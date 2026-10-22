'use client';

import { useState, useEffect, useCallback } from 'react';
import { CanvassingMap, CanvassingTag, SentimentStatus, Voter } from './types';

export const STORAGE_KEY = 'ward08_voter_canvassing_tags_v1';
export const EVENT_NAME = 'ward08_canvassing_update';

function getStoredCanvassing(): CanvassingMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to read canvassing from localStorage:', err);
    return {};
  }
}

function saveCanvassing(map: CanvassingMap) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: map }));
  } catch (err) {
    console.error('Failed to save canvassing to localStorage:', err);
  }
}

export function useCanvassing() {
  const [canvassing, setCanvassing] = useState<CanvassingMap>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setCanvassing(getStoredCanvassing());
    setIsReady(true);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CanvassingMap>;
      if (customEvent.detail) {
        setCanvassing(customEvent.detail);
      } else {
        setCanvassing(getStoredCanvassing());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getVoterTag = useCallback(
    (voterId: string): CanvassingTag => {
      return (
        canvassing[voterId] || {
          status: 'UNDECIDED',
          isLate: false,
          isDouble: false,
        }
      );
    },
    [canvassing]
  );

  const setVoterSentiment = useCallback(
    (voterId: string, status: SentimentStatus) => {
      setCanvassing((prev) => {
        const cur = prev[voterId] || {
          status: 'UNDECIDED',
          isLate: false,
          isDouble: false,
        };
        const nextStatus = cur.status === status ? 'UNDECIDED' : status;
        const nextMap: CanvassingMap = {
          ...prev,
          [voterId]: {
            ...cur,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          },
        };
        saveCanvassing(nextMap);
        return nextMap;
      });
    },
    []
  );

  const toggleLate = useCallback((voterId: string) => {
    setCanvassing((prev) => {
      const cur = prev[voterId] || {
        status: 'UNDECIDED',
        isLate: false,
        isDouble: false,
      };
      const nextMap: CanvassingMap = {
        ...prev,
        [voterId]: {
          ...cur,
          isLate: !cur.isLate,
          updatedAt: new Date().toISOString(),
        },
      };
      saveCanvassing(nextMap);
      return nextMap;
    });
  }, []);

  const toggleDouble = useCallback((voterId: string) => {
    setCanvassing((prev) => {
      const cur = prev[voterId] || {
        status: 'UNDECIDED',
        isLate: false,
        isDouble: false,
      };
      const nextMap: CanvassingMap = {
        ...prev,
        [voterId]: {
          ...cur,
          isDouble: !cur.isDouble,
          updatedAt: new Date().toISOString(),
        },
      };
      saveCanvassing(nextMap);
      return nextMap;
    });
  }, []);

  const loadSampleSurvey = useCallback((allVoters: Voter[]) => {
    // Generate realistic ground-level survey sample for demonstration and verification
    const sampleMap: CanvassingMap = {};
    allVoters.forEach((v, index) => {
      // Deterministic sample for reproducible testing:
      // ~2.5% marked late (50 voters)
      // ~2.0% marked double (40 voters)
      // ~58% favored, ~34% unfavored among surveyed, ~8% undecided
      const isLate = index % 40 === 0;
      const isDouble = index % 52 === 0;
      let status: SentimentStatus = 'UNDECIDED';
      
      if (!isLate && (index % 2 === 0 || index % 3 === 0)) {
        if (index % 5 === 0 || index % 7 === 0) {
          status = 'UNFAVOR';
        } else {
          status = 'FAVOR';
        }
      }

      if (isLate || isDouble || status !== 'UNDECIDED') {
        sampleMap[v.id] = {
          status,
          isLate,
          isDouble,
          updatedAt: new Date().toISOString(),
        };
      }
    });

    saveCanvassing(sampleMap);
    setCanvassing(sampleMap);
  }, []);

  const resetSurvey = useCallback(() => {
    saveCanvassing({});
    setCanvassing({});
  }, []);

  return {
    canvassing,
    isReady,
    getVoterTag,
    setVoterSentiment,
    toggleLate,
    toggleDouble,
    loadSampleSurvey,
    resetSurvey,
  };
}
