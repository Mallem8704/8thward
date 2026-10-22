import { NextRequest, NextResponse } from 'next/server';
import { getVoters, getSearchAliases, getHouseholds } from '@/lib/data';
import { Voter } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const exportType = searchParams.get('type') || 'FULL_DIRECTORY';
  const locality = searchParams.get('locality') || 'ALL';
  const gender = searchParams.get('gender') || 'ALL';
  const section = searchParams.get('section') || 'ALL';
  const search = searchParams.get('search') || '';

  const voters = getVoters();
  const searchAliases = getSearchAliases();
  const households = getHouseholds();

  let exportList: Voter[] = voters;

  if (exportType === 'DOUBLE_VOTERS') {
    const doubleIds = new Set<string>();
    searchAliases.same_door_duplicates.forEach((item) => {
      doubleIds.add(item.voter1.id);
      doubleIds.add(item.voter2.id);
    });
    searchAliases.cross_door_clusters.forEach((cluster) => {
      cluster.voters.forEach((v) => doubleIds.add(v.id));
    });
    exportList = voters.filter((v) => doubleIds.has(v.id));
  } else if (exportType === 'DOOR_WISE') {
    // Sorted by door density
    const doorDensityMap = new Map<string, number>();
    households.forEach((h) => doorDensityMap.set(h.house_number, h.voter_count));
    exportList = [...voters].sort((a, b) => {
      const dA = doorDensityMap.get(a.house_number_normalized) || 0;
      const dB = doorDensityMap.get(b.house_number_normalized) || 0;
      if (dB !== dA) return dB - dA;
      return a.ward_serial_number - b.ward_serial_number;
    });
  } else {
    // Normal filters
    if (locality !== 'ALL') {
      exportList = exportList.filter((v) => v.locality_id === locality);
    }
    if (gender !== 'ALL') {
      exportList = exportList.filter((v) => v.gender === gender);
    }
    if (section !== 'ALL') {
      exportList = exportList.filter((v) => v.section_number === section);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      exportList = exportList.filter(
        (v) =>
          v.voter_name_original.toLowerCase().includes(q) ||
          v.voter_name_english.toLowerCase().includes(q) ||
          v.epic_number.toLowerCase().includes(q) ||
          v.house_number_original.toLowerCase().includes(q) ||
          String(v.ward_serial_number) === q
      );
    }
  }

  // Generate CSV rows
  const headers = [
    'Ward Serial No',
    'EPIC Card No',
    'Voter Name (Telugu)',
    'Voter Name (English)',
    'Relationship Type',
    'Guardian Name (Telugu)',
    'Guardian Name (English)',
    'Age',
    'Gender',
    'House Number',
    'Canonical Locality',
    'Section Number',
    'PDF Page'
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvRows = [headers.join(',')];

  exportList.forEach((v) => {
    const row = [
      escapeCSV(v.ward_serial_number),
      escapeCSV(v.epic_number),
      escapeCSV(v.voter_name_original),
      escapeCSV(v.voter_name_english),
      escapeCSV(v.relation_type),
      escapeCSV(v.relation_name_original),
      escapeCSV(v.relation_name_english),
      escapeCSV(v.age),
      escapeCSV(v.gender),
      escapeCSV(v.house_number_original),
      escapeCSV(v.locality_name),
      escapeCSV(v.section_number),
      escapeCSV(v.source_pdf_page)
    ];
    csvRows.push(row.join(','));
  });

  // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility with Telugu script
  const csvContent = '\uFEFF' + csvRows.join('\r\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="Kadiri_Ward08_${exportType}.csv"`,
    },
  });
}
