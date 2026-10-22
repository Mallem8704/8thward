import fitz
import re
import sys
import json
import os
from collections import defaultdict, Counter

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\malle\Downloads\WARD 8_compressed.pdf'
doc = fitz.open(pdf_path)

print(f"Loading PDF from {pdf_path}... Pages: {len(doc)}")

# Comprehensive Telugu name mapping dictionary
TELUGU_DICT = {
    # Titles & Communities
    'షేక్': 'Shaik', 'షైక్': 'Shaik', 'శేక్': 'Shaik', 'పఠాన్': 'Pathan', 'పటాన్': 'Pathan',
    'సయ్యద్': 'Sayyad', 'సయద్': 'Sayyad', 'బాషా': 'Basha', 'బాష': 'Basha', 'బాశా': 'Basha',
    'సాహెబ్': 'Saheb', 'సాబ్': 'Saheb', 'వలి': 'Vali', 'వలీ': 'Vali', 'ఖాన్': 'Khan',
    'ఖాన్‍': 'Khan', 'బేగం': 'Begum', 'బెగం': 'Begum', 'బేగమ్': 'Begum', 'రెడ్డి': 'Reddy',
    'రేడ్డీ': 'Reddy', 'నాయుడు': 'Naidu', 'నాయక్': 'Nayak', 'శెట్టి': 'Setty', 'శేట్టి': 'Setty',
    'సేతీ': 'Setty', 'చారి': 'Chari', 'రావు': 'Rao', 'రావ': 'Rao', 'మూర్తి': 'Murthy',
    'స్వామి': 'Swamy', 'స్వామీ': 'Swamy', 'సింగ్': 'Singh', 'వర్మ': 'Varma', 'గుప్తా': 'Gupta',

    # First Names & Common Words
    'శ్రీరాములు': 'Sreeramulu', 'శ్రీీరాములు': 'Sreeramulu', 'శ్రీనివాసులు': 'Srinivasulu',
    'శ్రీీనివాసులు': 'Srinivasulu', 'శ్రీనివాస': 'Srinivasa', 'శ్రీీనివాస': 'Srinivasa',
    'నారాయణ': 'Narayana', 'రామచంద్ర': 'Ramachandra', 'రామచంద్రుడు': 'Ramachandrudu',
    'రామకృష్ణ': 'Ramakrishna', 'రామక్రిష్ణ': 'Ramakrishna', 'రాముడు': 'Ramudu', 'రాములు': 'Ramulu',
    'రాము': 'Ramu', 'రామ': 'Rama', 'లక్ష్మీనారాయణ': 'Lakshmi Narayana', 'లక్ష్మినారాయణ': 'Lakshmi Narayana',
    'లక్ష్మీనరస': 'Lakshmi Narasa', 'వెంకట': 'Venkata', 'వేంకట': 'Venkata', 'వెంకటేశ్వర్లు': 'Venkateswarlu',
    'వెంకటేశు': 'Venkatesu', 'వెంకటరమణ': 'Venkataramana', 'వెంకటస్వామి': 'Venkataswamy',
    'ఆంజనేయులు': 'Anjaneyulu', 'ఆంజినేయులు': 'Anjaneyulu', 'నరసింహులు': 'Narasimhulu',
    'హనుమంత': 'Hanumantha', 'సుబ్బయ్య': 'Subbayya', 'సుబ్బారావు': 'Subba Rao', 'గంగన్న': 'Ganganna',
    'గంగిరెడ్డి': 'Gangireddy', 'పుల్లప్ప': 'Pullappa', 'పెద్దన్న': 'Peddanna', 'చిన్నప్ప': 'Chinnappa',
    'గోపాల్': 'Gopal', 'సుధాకర్': 'Sudhakar', 'ప్రభాకర్': 'Prabhakar', 'భాస్కర్': 'Bhaskar',
    'ప్రసాద్': 'Prasad', 'కుమార్': 'Kumar', 'మోహన్': 'Mohan', 'మురళీమోహన్': 'Murali Mohan',
    'రమేష్': 'Ramesh', 'రమేశ్': 'Ramesh', 'సురేష్': 'Suresh', 'మహేష్': 'Mahesh', 'దినేష్': 'Dinesh',
    'దినేశ్': 'Dinesh', 'నరేష్': 'Naresh', 'నరేశ్': 'Naresh', 'రాజేష్': 'Rajesh', 'హరీష్': 'Harish',
    'హరీశ్': 'Harish', 'సతీష్': 'Satish', 'సతీశ్': 'Satish', 'జగదీష్': 'Jagadeesh', 'జగదీశ్': 'Jagadeesh',
    'రవి': 'Ravi', 'శివ': 'Shiva', 'శంకర్': 'Shankar', 'సునీల్': 'Sunil', 'అనిల్': 'Anil',
    'అనీల్': 'Anil', 'కిరణ్': 'Kiran', 'పవన్': 'Pavan', 'కళ్యాణ్': 'Kalyan', 'కల్యాణ్': 'Kalyan',
    'చంద్రశేఖర్': 'Chandrasekhar', 'శేఖర్': 'Sekhar', 'సోమశేఖర్': 'Somasekhar', 'విక్రమ్': 'Vikram',
    'అశోక్': 'Ashok', 'విజయ్': 'Vijay', 'విజయ': 'Vijaya', 'ఆనంద్': 'Anand', 'సంతోష్': 'Santosh',
    'సంతోశ్': 'Santosh', 'కార్తీక్': 'Karthik', 'కార్తిక్': 'Karthik', 'సాయి': 'Sai',

    # Muslim Names
    'మహబూబ్': 'Mahaboob', 'మహమ్మద్': 'Mahammad', 'అక్బర్': 'Akbar', 'హుస్సేన్': 'Hussain',
    'అన్వర్': 'Anwar', 'అస్లాం': 'Aslam', 'ఇక్బాల్': 'Iqbal', 'ఇమ్రాన్': 'Imran', 'ఇర్ఫాన్': 'Irfan',
    'ఉస్మాన్': 'Usman', 'ఖాదర్': 'Khader', 'గౌస్': 'Ghouse', 'జాఫర్': 'Jafar', 'ఫరూక్': 'Farooq',
    'రహీమ్': 'Raheem', 'రహమాన్': 'Rahman', 'రఫీ': 'Rafi', 'రియాజ్': 'Riyaz', 'సలీమ్': 'Saleem',
    'సలీం': 'Saleem', 'షామీర్': 'Shameer', 'ఫయాజ్': 'Fayaz', 'సుబహాన్': 'Subhan', 'ఖాసిమ్': 'Khassim',
    'చాంద్': 'Chand', 'బాబ్జాన్': 'Babjan', 'ఫక్రుద్దీన్': 'Fakruddin', 'నిజాముద్దీన్': 'Nizamuddin',
    'ముస్తఫా': 'Mustafa', 'ముస్తాపా': 'Mustafa', 'మస్తాన్': 'Mastan', 'అమీర్': 'Ameer',
    'కమాల్': 'Kamal', 'నజీర్': 'Nazeer', 'రసూల్': 'Rasool', 'షఫీ': 'Shafi', 'హామీద్': 'Hameed',
    'తౌసీఫ్': 'Thouseef', 'మునాఫ్': 'Munaf', 'సులేమాన్': 'Suleman', 'అజీజ్': 'Azeez',
    'సిరాజ్': 'Siraj', 'అబ్దుల్': 'Abdul', 'ఆయేషా': 'Ayesha', 'ఫాతిమా': 'Fathima', 'నసీం': 'Naseem',
    'హసీనా': 'Haseena', 'జాహిదా': 'Zahida', 'పర్వీన్': 'Parveen', 'షబానా': 'Shabana', 'నూర్జహాన్': 'Noorjahan',
    'నూర్': 'Noor', 'జహాన్': 'Jahan', 'ముంతాజ్': 'Mumtaz', 'మూంతాజ్': 'Mumtaz', 'సుల్తానా': 'Sulthana',
    'సోని': 'Soni', 'షాహీన్': 'Shaheen', 'షహీన': 'Shaheen', 'షకీలా': 'Shakeela', 'షకీల': 'Shakeela',
    'సమీర': 'Sameera', 'అఫ్రోజ్': 'Afroz', 'రిజ్వానా': 'Rizwana', 'ఆరిఫా': 'Arifa', 'రమీజా': 'Rameeza',
    'ఫక్రున్నిసా': 'Fakrunnisa', 'కైరున్నిసా': 'Kairunnisa',

    # Female Telugu Names
    'లక్ష్మి': 'Lakshmi', 'లక్ష్మీ': 'Lakshmi', 'లక్ష్మమ్మ': 'Lakshmamma', 'రామలక్ష్మి': 'Ramalakshmi',
    'రామలక్ష్మమ్మ': 'Ramalakshmamma', 'సరస్వతి': 'Saraswathi', 'సరస్వతమ్మ': 'Saraswathamma',
    'పార్వతి': 'Parvathi', 'పార్వతమ్మ': 'Parvathamma', 'సుజాత': 'Sujatha', 'అనిత': 'Anitha',
    'సునీత': 'Sunitha', 'కవిత': 'Kavitha', 'లలిత': 'Lalitha', 'శోభ': 'Shobha', 'ఉమ': 'Uma',
    'పద్మ': 'Padma', 'పద్మావతి': 'Padmavathi', 'గాయత్రి': 'Gayathri', 'భవాని': 'Bhavani',
    'రాధ': 'Radha', 'రమ్య': 'Ramya', 'స్వప్న': 'Swapna', 'మౌనిక': 'Mounika', 'హారిక': 'Harika',
    'సుమ': 'Suma', 'సుమలత': 'Sumalatha', 'స్వర్ణలత': 'Swarnalatha', 'సుధారాణి': 'Sudharani',
    'సుధారాణీ': 'Sudharani', 'అమరావతి': 'Amaravathi', 'నాగమ్మ': 'Nagamma', 'గంగమ్మ': 'Gangamma',
    'తిమ్మమ్మ': 'Thimmamma', 'వెంకటమ్మ': 'Venkatamma', 'సుగుణమ్మ': 'Sugunamma', 'కాంతమ్మ': 'Kanthamma',
    'శాంతమ్మ': 'Shanthamma', 'రంగమ్మ': 'Rangamma', 'సుశీల': 'Susheela', 'సుశీలమ్మ': 'Susheelamma',
    'జయమ్మ': 'Jayamma', 'రుక్మిణి': 'Rukmini', 'అంజనమ్మ': 'Anjanamma', 'ఆదెమ్మ': 'Ademma',
    'ఆదిలక్ష్మి': 'Adilakshmi', 'ప్రమీల': 'Pramila', 'శారద': 'Sharada', 'సరోజ': 'Saroja',
    'సరోజమ్మ': 'Sarojamma', 'దేవి': 'Devi', 'దేవీ': 'Devi', 'కుమారి': 'Kumari', 'కుమారీ': 'Kumari',
    'భారతి': 'Bharathi', 'వరలక్ష్మి': 'Varalakshmi', 'కళావతి': 'Kalavathi', 'గీత': 'Geetha',
    'అరుణ': 'Aruna', 'అనూరాధ': 'Anuradha', 'శివమ్మ': 'Shivamma', 'ఈశ్వరమ్మ': 'Eswaramma',

    # Surnames & Localities
    'దేవరకొండ': 'Devarakonda', 'పాలూరి': 'Paloori', 'పూజారి': 'Poojari', 'తల్లూరి': 'Talluri',
    'మంచాల': 'Manchala', 'అక్కీలికూంతా': 'Akkilikoonta', 'ఏస్లావథ': 'Eslavath', 'ఏస్లావథ్': 'Eslavath',
    'కూతగూళ్ళ': 'Koothagulla', 'ఇంజేటి': 'Injeti', 'బిడుపల్లి': 'Bidupalli', 'యాడికి': 'Yadiki',
    'కొమ్ము': 'Kommu', 'కొమ్మరి': 'Kommari', 'తుమ్మల': 'Tummala', 'మర్రికొమ్మదిన్నె': 'Marrikommadinne',
    'కత్లగల': 'Katlagala', 'కాదిరొలా': 'Kadirola', 'నూతనకాల్వ': 'Noothanakalva', 'తారమర్లా': 'Taramarla',
    'కర్ణం': 'Karnam', 'నాదెళ్ల': 'Nadella', 'పేన్నాబదీ': 'Pennabadi', 'కొండకమర్ల': 'Kondakamarla',
    'వాట్కిన్స్': 'Watkins', 'కుర్లి': 'Kurli', 'గుగ్గుల': 'Guggula', 'గుగ్గూల్లా': 'Guggulla',
    'పులివెందల': 'Pulivendula', 'గండి': 'Gandi', 'బోలె': 'Bole', 'బోలే': 'Bole', 'తుమ్మలపల్లి': 'Tummalapalli',
    'కొట్టి': 'Kotti', 'గాజి': 'Gaji', 'బెస్త': 'Besta', 'బేస్ట': 'Besta', 'కొవ్వూరి': 'Kovvoori',
    'కొవ్వూరు': 'Kovvoori', 'ముంగరా': 'Mungara', 'మైనాఎం': 'Mainam', 'పగిడిపల్లి': 'Pagidipalli',
    'కోటగస్టి': 'Kotagasti', 'చెల్లా': 'Chella', 'గూడురి': 'Guduri', 'ఎర్రగొండ': 'Erragonda',
    'ఎర్రగొం డ': 'Erragonda', 'కోనపల్లి': 'Konapalli', 'దేవరింటి': 'Devarinti', 'రసావరిపఅలీ': 'Rasavaripalli',
    'కురిలీ': 'Kurili', 'రాచావారీపల్లి': 'Rachavaripalli', 'రాచువారిపల్లి': 'Rachavaripalli',
    'వెల్దుర్తి': 'Veldurthi', 'చిట్వేర్': 'Chitvel', 'అలుగూటి': 'Alugooti', 'అల్లుగుంటి': 'Allugunti',
    'నాలబంద్': 'Nalaband', 'నాగూరి': 'Nagoori', 'కొత్తకోట': 'Kothakota', 'కోత్తకోత్తట': 'Kothakota',
    'సోమేసుల': 'Somesula', 'సొమేసూలా': 'Somesula', 'గాజుల': 'Gajula', 'గణపర్థి': 'Ganaparthi',
    'రుద్ర': 'Rudra', 'సతార్ల': 'Satharla', 'శతర్ల': 'Satharla', 'కాకర్ల': 'Kakarla',
    'కొనకొండ్ల': 'Konakondla', 'బాయామూతక': 'Bayamuthaka', 'పందిపోతు': 'Pandipothu', 'బడిగించల': 'Badiginchala',
    'బడిగంచల': 'Badiganchala', 'సంగ': 'Sanga', 'ఎద్దుల': 'Yeddula', 'లోసారీ': 'Losari',
    'పెనుగొండ': 'Penugonda', 'పెనుకొండ': 'Penukonda', 'బుక్కె': 'Bukke', 'బుకే': 'Bukke',
    'జరిపేటి': 'Jaripeti', 'వల్లేపు': 'Vallepu', 'సొప్పరం': 'Sopparam', 'ముట్టన': 'Muttana',
    'మలకా': 'Malaka', 'మద్దుల': 'Maddula', 'మోపూరిశెట్టి': 'Mopurisetty', 'పాలెం': 'Palem',
    'మండు': 'Mandla', 'మండల': 'Mandla', 'సుంకు': 'Sunku', 'బోజనం': 'Bojanam', 'భోజనం': 'Bojanam',
    'బసెట్టి': 'Basetty', 'బసిటి': 'Basetty', 'ముద్దాంగుల': 'Muddangula', 'పసుపులేటి': 'Pasupuleti',
    'సాకివేలా': 'Sakivela', 'కొర్రపాటి': 'Korrapati', 'ముక్తాపురం': 'Mukthapuram', 'పల్లపుర్': 'Pallapuru',
    'కమలాపురం': 'Kamalapuram', 'ముప్పే': 'Muppe', 'యమ్మనూరు': 'Yammanuru', 'ఎమ్మనూరు': 'Yammanuru',
    'తలమర్ల': 'Talamarla', 'కొండ్రెడ్డి': 'Kondreddy', 'కొక్కంటి': 'Kokkanti', 'ఉడములకుర్తి': 'Udamulakurthi',
    'పసల': 'Pasala', 'ఏన్ద్రావథ': 'Endravath', 'కప్సే': 'Kapse', 'కిన్నెర': 'Kinnera', 'చల్లగాలి': 'Challagali',
    'కొలిమిగుండ్ల': 'Kolimigundla', 'పుష్పనాని': 'Pushpanani', 'సింగణమాల': 'Singanamala',
    'బాన్నోత్': 'Bannoth', 'బాణోత్': 'Bannoth', 'చిన్నసాని': 'Chinnasani', 'శంపూరీ': 'Shampoori',
    'చారుపల్లె': 'Charupalle', 'చారుపల్లి': 'Charupalli', 'జోగి': 'Jogi', 'కటకం': 'Katakam',
    'చుక్క': 'Chukka', 'రాగుల': 'Ragula', 'పోతుల': 'Pothula', 'సావళ్ళా': 'Savalla',
    'ఉంట్ల': 'Untla', 'మల్లెల': 'Mallela', 'మల్లెలల్లె': 'Mallela', 'బజంత్రీలు': 'Bajanthreelu',
    'కరమల': 'Karamala', 'తలారి': 'Talari', 'చిదిగే': 'Chidige', 'మంచూరి': 'Manchoori',
    'తాముటకా': 'Tamutaka', 'తాముటక': 'Tamutaka', 'శింగారం': 'Singaram', 'కోగర': 'Kogara',
    'గుడిసి': 'Gudise', 'గుడిసె': 'Gudise', 'గడిదామల్ల': 'Gadidhamalla', 'చిన్నకోట్ల': 'Chinnakotla',
    'కుంచపు': 'Kunchapu', 'కుంచెపు': 'Kunchapu', 'డాన్నికోట': 'Dannikota', 'దూదేకుల': 'Dudekula',
    'కమతంపల్లి': 'Kamatampalli', 'తరిగోపాల': 'Tarigopala', 'పుట్టపర్తి': 'Puttaparthi',
    'పట్నం': 'Patnam', 'కమతం': 'Kamatam', 'ఆవులపల్లి': 'Avulapalli', 'దండుపల్లి': 'Dandupalli',
    'సుండుపల్లె': 'Sundupalle', 'సోమిశెట్టి': 'Somisetty', 'అరమడక': 'Aramadaka', 'బొజనపూ': 'Bojanapu',
    'భూపతి': 'Bhoopathi', 'పండుగట్టు': 'Pandugattu', 'ఇందుకూరి': 'Indukoori'
}

CHAR_MAP = {
    'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo', 'ఋ': 'ru',
    'ఎ': 'e', 'ఏ': 'e', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'o', 'ఔ': 'au',
    'క': 'k', 'ఖ': 'kh', 'గ': 'g', 'ఘ': 'gh', 'ఙ': 'ng',
    'చ': 'ch', 'ఛ': 'chh', 'జ': 'j', 'ఝ': 'jh', 'ఞ': 'ny',
    'ట': 't', 'ఠ': 'th', 'డ': 'd', 'ఢ': 'dh', 'ణ': 'n',
    'త': 'th', 'థ': 'th', 'ద': 'd', 'ధ': 'dh', 'న': 'n',
    'ప': 'p', 'ఫ': 'ph', 'బ': 'b', 'భ': 'bh', 'మ': 'm',
    'య': 'y', 'ర': 'r', 'ల': 'l', 'వ': 'v', 'శ': 'sh', 'ష': 'sh', 'స': 's', 'హ': 'h',
    'ళ': 'l', 'క్ష': 'ksh', 'ఱ': 'r',
    'ా': 'a', 'ి': 'i', 'ీ': 'ee', 'ు': 'u', 'ూ': 'oo', 'ృ': 'ru',
    'ె': 'e', 'ే': 'e', 'ై': 'ai', 'ొ': 'o', 'ో': 'o', 'ౌ': 'au',
    'ం': 'm', 'ః': 'h', '్': ''
}

def clean_telugu(t):
    if not t: return ''
    t = t.replace('\u200c', '').replace('\u200d', '').replace('\u200b', '')
    t = re.sub(r'([ిీుూెేొో])\1+', r'\1', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def transliterate_word(w):
    w = clean_telugu(w)
    if not w: return ''
    if w in TELUGU_DICT:
        return TELUGU_DICT[w]
    
    out = []
    i = 0
    n = len(w)
    while i < n:
        c = w[i]
        nxt = w[i+1] if i+1 < n else ''
        
        if c in 'కఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవశషసహళక్షఱ':
            base = CHAR_MAP.get(c, '')
            if nxt == '్': # conjunct
                i += 2
                continue_cons = True
                while continue_cons and i < n:
                    c2 = w[i]
                    nxt2 = w[i+1] if i+1 < n else ''
                    base += CHAR_MAP.get(c2, '')
                    if nxt2 == '్':
                        i += 2
                    else:
                        if nxt2 in 'ాిీుూృెేైొోౌం':
                            base += CHAR_MAP.get(nxt2, '')
                            i += 2
                        else:
                            base += 'a'
                            i += 1
                        continue_cons = False
                out.append(base)
                continue
            elif nxt in 'ాిీుూృెేైొోౌం':
                out.append(base + CHAR_MAP.get(nxt, ''))
                i += 2
                continue
            else:
                out.append(base + 'a')
                i += 1
                continue
        elif c in CHAR_MAP:
            out.append(CHAR_MAP[c])
            i += 1
        else:
            out.append(c)
            i += 1
            
    res = ''.join(out)
    res = re.sub(r'a+', 'a', res)
    return res.capitalize()

def transliterate_name(name):
    if not name: return ''
    name = clean_telugu(name)
    if re.search(r'^[A-Za-z0-9\s\.\-_/]+$', name):
        return name.strip()
    words = name.split()
    res = [transliterate_word(w) for w in words]
    return ' '.join(res)

def normalize_house(h):
    if not h: return 'UNASSIGNED'
    h = h.strip()
    # Replace non-ascii spaces, slashes
    h = re.sub(r'\s+', ' ', h)
    h = h.replace(' / ', '/').replace(' /', '/').replace('/ ', '/')
    h = h.replace(' - ', '-').replace(' -', '-').replace('- ', '-')
    h = h.upper()
    return h

# Extract all voters
voters = []
for pno in range(3, len(doc)):
    page_num = pno + 1
    text = doc[pno].get_text()
    parts = re.split(r'వార్డు\.ఓ\.జా\.వ\.సం\.', text)
    for part in parts[1:]:
        m_sno = re.search(r'^\s*[\.\s]*(\d+)', part)
        sno = int(m_sno.group(1)) if m_sno else None
        
        m_asmb = re.search(r'అ\.ఓ\.జా\.వ\.సం\s*[\.:]*\s*161\s*-\s*(\d+)\s*-\s*(\d+)', part)
        section = m_asmb.group(1) if m_asmb else ''
        asmb_sno = int(m_asmb.group(2)) if (m_asmb and m_asmb.group(2).isdigit()) else 0
        
        m_epic = re.search(r'ఓటరు\s*ఐడి[^\n:]*:\s*([A-Z0-9/]+)', part)
        if not m_epic:
            m_epic = re.search(r'([A-Z]{3}[0-9]{7}|[A-Z]{3}/[0-9]{6}|[A-Z0-9]{10})', part)
        epic = m_epic.group(1).strip() if m_epic else ''
        
        m_vname = re.search(r'ఓటరు\s*పేరు\s*\n?\s*:\s*([^\n]+)', part)
        vname = clean_telugu(m_vname.group(1)) if m_vname else ''
        
        m_rel = re.search(r'(తండ్రి[ి]?|భర్త[ి]?|తల్లి[ి]?|సంరక్షకు[డుర]|ఇతర)[^\n:]*\n?\s*:\s*([^\n]+)', part)
        if m_rel:
            raw_rtype = m_rel.group(1)
            if 'తండ్రి' in raw_rtype:
                rtype = 'FATHER'
            elif 'భర్త' in raw_rtype:
                rtype = 'HUSBAND'
            elif 'తల్లి' in raw_rtype:
                rtype = 'MOTHER'
            else:
                rtype = 'OTHER'
            rname = clean_telugu(m_rel.group(2))
        else:
            rtype = 'OTHER'
            rname = ''
            if m_vname:
                vname_end = m_vname.end()
                m_age = re.search(r'వయస్సు', part[vname_end:])
                if m_age:
                    between = part[vname_end:vname_end + m_age.start()]
                    m_colon = re.search(r':\s*([^\n]+)', between)
                    if m_colon:
                        rname = clean_telugu(m_colon.group(1))
                        # Infer FATHER / HUSBAND based on typical conventions
                        rtype = 'FATHER'
            
        m_age = re.search(r'వయస్సు\s*\n?\s*:\s*(\d+)', part)
        age = int(m_age.group(1)) if m_age else 0
        
        m_gen = re.search(r'లింగము\s*:\s*(పు|స్త్రీ|ఇతరులు)', part)
        g_raw = m_gen.group(1) if m_gen else ''
        gender = 'MALE' if g_raw == 'పు' else ('FEMALE' if g_raw == 'స్త్రీ' else 'OTHER')
        
        m_house = re.search(r'ఇంటి\s*సంఖ్య\s*\n?\s*:\s*([^\n]+)', part)
        house_orig = clean_telugu(m_house.group(1)) if m_house else ''
        house_norm = normalize_house(house_orig)
        
        # Locality assignment based on official section & index matching
        locality_id = 'adapala-street'
        locality_name = 'అడపాల స్ట్రీట్ / Adapala Street'
        locality_source_name = 'అడపాల స్ట్రీట్'
        
        if section == '78':
            locality_id = 'water-tank-road'
            locality_name = 'వాటర్ ట్యాంక్ రోడ్డు / Water Tank Road'
            locality_source_name = 'వాటర్ ట్యాంక్ రోడ్డు'
        elif section == '79':
            if sno is not None and 19 <= sno <= 115:
                locality_id = 'water-tank-road'
                locality_name = 'వాటర్ ట్యాంక్ రోడ్డు / Water Tank Road'
                locality_source_name = 'వాటర్ ట్యాంక్ రోడ్డు'
        elif section == '80':
            if sno in [10, 11, 12, 13, 14, 15, 16, 17, 40, 41, 107]:
                locality_id = 'rs-road'
                locality_name = 'ఆర్ ఎస్ రోడ్డు / RS Road'
                locality_source_name = 'ఆర్ ఎస్ రోడ్డు'
        elif section == '81':
            if 331 <= asmb_sno <= 419:
                locality_id = 'water-tank-road'
                locality_name = 'వాటర్ ట్యాంక్ రోడ్డు / Water Tank Road'
                locality_source_name = 'వాటర్ ట్యాంక్ రోడ్డు'
            elif sno in [37, 38, 58]:
                locality_id = 'rs-road'
                locality_name = 'ఆర్ ఎస్ రోడ్డు / RS Road'
                locality_source_name = 'ఆర్ ఎస్ రోడ్డు'
        elif section == '82':
            if sno == 64:
                locality_id = 'rs-road'
                locality_name = 'ఆర్ ఎస్ రోడ్డు / RS Road'
                locality_source_name = 'ఆర్ ఎస్ రోడ్డు'
            elif sno == 2006:
                locality_id = 'rajiv-gandhi-nagar'
                locality_name = 'రాజీవ్ గాంధీ నగర్ / Rajiv Gandhi Nagar'
                locality_source_name = 'రాజీవ్ గాంధీ నగర్'

        voters.append({
            'id': f"w8_voter_{sno}",
            'ward_serial_number': sno,
            'epic_number': epic,
            'voter_name_original': vname,
            'voter_name_english': transliterate_name(vname),
            'relation_type': rtype,
            'relation_name_original': rname,
            'relation_name_english': transliterate_name(rname),
            'age': age,
            'gender': gender,
            'house_number_original': house_orig,
            'house_number_normalized': house_norm,
            'locality_id': locality_id,
            'locality_name': locality_name,
            'locality_source_name': locality_source_name,
            'section_number': section,
            'source_pdf_page': page_num
        })

print(f"Total extracted voters: {len(voters)}")

# Verification checks
assert len(voters) == 2013, f"Expected 2013 voters, got {len(voters)}"
male_cnt = sum(1 for v in voters if v['gender'] == 'MALE')
fem_cnt = sum(1 for v in voters if v['gender'] == 'FEMALE')
oth_cnt = sum(1 for v in voters if v['gender'] == 'OTHER')
assert male_cnt == 957, f"Expected 957 male voters, got {male_cnt}"
assert fem_cnt == 1056, f"Expected 1056 female voters, got {fem_cnt}"
assert oth_cnt == 0, f"Expected 0 other voters, got {oth_cnt}"

# Check locality totals
loc_counts = Counter(v['locality_id'] for v in voters)
print("Locality voter counts:", loc_counts)
assert loc_counts['adapala-street'] == 1819, f"Adapala expected 1819, got {loc_counts['adapala-street']}"
assert loc_counts['water-tank-road'] == 178, f"Water Tank expected 178, got {loc_counts['water-tank-road']}"
assert loc_counts['rs-road'] == 15, f"RS Road expected 15, got {loc_counts['rs-road']}"
assert loc_counts['rajiv-gandhi-nagar'] == 1, f"Rajiv Gandhi Nagar expected 1, got {loc_counts['rajiv-gandhi-nagar']}"
assert sum(loc_counts.values()) == 2013

# Check unassigned doors or localities
assert all(v['locality_id'] for v in voters)
assert all(v['house_number_normalized'] for v in voters)
assert all(v['epic_number'] for v in voters)
assert all(v['source_pdf_page'] >= 4 for v in voters)

# 2. Build Households
house_groups = defaultdict(list)
for v in voters:
    house_groups[v['house_number_normalized']].append(v)

households = []
for h_norm, vlist in house_groups.items():
    primary_loc_id = Counter(v['locality_id'] for v in vlist).most_common(1)[0][0]
    primary_loc_name = Counter(v['locality_name'] for v in vlist).most_common(1)[0][0]
    
    m_count = sum(1 for v in vlist if v['gender'] == 'MALE')
    f_count = sum(1 for v in vlist if v['gender'] == 'FEMALE')
    
    # Sort voters inside household by age descending or serial
    vlist_sorted = sorted(vlist, key=lambda x: x['ward_serial_number'])
    
    households.append({
        'house_number': h_norm,
        'house_id': re.sub(r'[^A-Z0-9]', '_', h_norm),
        'locality_id': primary_loc_id,
        'locality_name': primary_loc_name,
        'voter_count': len(vlist),
        'male_count': m_count,
        'female_count': f_count,
        'voters': [{
            'id': v['id'],
            'ward_serial_number': v['ward_serial_number'],
            'voter_name_original': v['voter_name_original'],
            'voter_name_english': v['voter_name_english'],
            'relation_type': v['relation_type'],
            'relation_name_original': v['relation_name_original'],
            'relation_name_english': v['relation_name_english'],
            'age': v['age'],
            'gender': v['gender'],
            'epic_number': v['epic_number'],
            'section_number': v['section_number'],
            'source_pdf_page': v['source_pdf_page']
        } for v in vlist_sorted]
    })

# Sort households by voter count descending (Top Door Numbers ranked in decreasing order)
households.sort(key=lambda h: (-h['voter_count'], h['house_number']))

print(f"Total households generated: {len(households)}")
print(f"Top 5 households by voter count:")
for h in households[:5]:
    print(f"  House '{h['house_number']}': {h['voter_count']} voters (Locality: {h['locality_id']})")

# 3. Build Localities
localities = [
    {
        'id': 'adapala-street',
        'name_en': 'Adapala Street',
        'name_te': 'అడపాల స్ట్రీట్',
        'display_name': 'అడపాల స్ట్రీట్ / Adapala Street',
        'total_voters': 1819,
        'male_voters': 863,
        'female_voters': 956,
        'other_voters': 0,
        'households_count': sum(1 for h in households if h['locality_id'] == 'adapala-street'),
        'sections': sorted(list(set(v['section_number'] for v in voters if v['locality_id'] == 'adapala-street')), key=lambda s: int(s) if s.isdigit() else 999)
    },
    {
        'id': 'water-tank-road',
        'name_en': 'Water Tank Road',
        'name_te': 'వాటర్ ట్యాంక్ రోడ్డు',
        'display_name': 'వాటర్ ట్యాంక్ రోడ్డు / Water Tank Road',
        'total_voters': 178,
        'male_voters': 84,
        'female_voters': 94,
        'other_voters': 0,
        'households_count': sum(1 for h in households if h['locality_id'] == 'water-tank-road'),
        'sections': sorted(list(set(v['section_number'] for v in voters if v['locality_id'] == 'water-tank-road')), key=lambda s: int(s) if s.isdigit() else 999)
    },
    {
        'id': 'rs-road',
        'name_en': 'RS Road',
        'name_te': 'ఆర్ ఎస్ రోడ్డు',
        'display_name': 'ఆర్ ఎస్ రోడ్డు / RS Road',
        'total_voters': 15,
        'male_voters': 9,
        'female_voters': 6,
        'other_voters': 0,
        'households_count': sum(1 for h in households if h['locality_id'] == 'rs-road'),
        'sections': sorted(list(set(v['section_number'] for v in voters if v['locality_id'] == 'rs-road')), key=lambda s: int(s) if s.isdigit() else 999)
    },
    {
        'id': 'rajiv-gandhi-nagar',
        'name_en': 'Rajiv Gandhi Nagar',
        'name_te': 'రాజీవ్ గాంధీ నగర్',
        'display_name': 'రాజీవ్ గాంధీ నగర్ / Rajiv Gandhi Nagar',
        'total_voters': 1,
        'male_voters': 1,
        'female_voters': 0,
        'other_voters': 0,
        'households_count': sum(1 for h in households if h['locality_id'] == 'rajiv-gandhi-nagar'),
        'sections': sorted(list(set(v['section_number'] for v in voters if v['locality_id'] == 'rajiv-gandhi-nagar')), key=lambda s: int(s) if s.isdigit() else 999)
    }
]

# 4. Search aliases & duplicate detection
same_door_duplicates = []
name_clusters = defaultdict(list)

# Group by name across ward
for v in voters:
    # clean name key
    name_key = re.sub(r'\s+', '', v['voter_name_original'])
    name_clusters[name_key].append(v)

# Check same-door duplicates
for h in households:
    h_voters = h['voters']
    for i in range(len(h_voters)):
        for j in range(i+1, len(h_voters)):
            v1 = h_voters[i]
            v2 = h_voters[j]
            # Same name or same relative and similar age
            name_sim = (v1['voter_name_original'] == v2['voter_name_original'])
            rel_sim = (v1['relation_name_original'] and v1['relation_name_original'] == v2['relation_name_original'] and abs(v1['age'] - v2['age']) <= 2 and v1['gender'] == v2['gender'])
            if name_sim or rel_sim:
                same_door_duplicates.append({
                    'house_number': h['house_number'],
                    'voter1': v1,
                    'voter2': v2,
                    'reason': 'Same Name in Same Door' if name_sim else 'Same Guardian & Gender in Same Door'
                })

cross_door_clusters = []
for nkey, vlist in name_clusters.items():
    if len(vlist) > 1:
        # Check if they span multiple doors
        doors = set(v['house_number_normalized'] for v in vlist)
        if len(doors) > 1:
            cross_door_clusters.append({
                'name_original': vlist[0]['voter_name_original'],
                'name_english': vlist[0]['voter_name_english'],
                'voter_count': len(vlist),
                'doors': list(doors),
                'voters': [{
                    'id': v['id'],
                    'ward_serial_number': v['ward_serial_number'],
                    'epic_number': v['epic_number'],
                    'age': v['age'],
                    'gender': v['gender'],
                    'house_number': v['house_number_normalized'],
                    'relation_type': v['relation_type'],
                    'relation_name': v['relation_name_english'],
                    'locality_name': v['locality_name'],
                    'source_pdf_page': v['source_pdf_page']
                } for v in vlist]
            })

cross_door_clusters.sort(key=lambda x: -x['voter_count'])

search_aliases = {
    'ward_metadata': {
        'municipality_en': 'Kadiri',
        'municipality_te': 'కదిరి పురపాలక సంఘం',
        'ward_number': 8,
        'district_en': 'Sri Sathya Sai District',
        'district_te': 'శ్రీ సత్యసాయి జిల్లా',
        'assembly_constituency': '161 - Kadiri',
        'total_voters': 2013,
        'male_voters': 957,
        'female_voters': 1056,
        'other_voters': 0,
        'total_households': len(households),
        'qualifying_date': '01-01-2026',
        'publication_date': '22-09-2026'
    },
    'phonetic_substitutions': {
        'shaik': ['sek', 'sheik', 'shake', 'syed', 'saik'],
        'pathan': ['patan', 'khan', 'pattan'],
        'reddy': ['redi', 'reddi', 'reddey'],
        'rao': ['ravu', 'row'],
        'setty': ['shetti', 'setti', 'chetty'],
        'chari': ['chary', 'aachari'],
        'swamy': ['swami', 'swamee'],
        'ramulu': ['ramu', 'ramudu', 'ram'],
        'srinivasulu': ['srinivas', 'seenappa', 'seenu', 'srinu'],
        'venkata': 'venkat',
        'lakshmi': ['laxmi', 'laksmi', 'luxmi'],
        'subba': 'subbu',
        'ganganna': ['gangi', 'gangappa'],
        'basha': ['baasha', 'baasha', 'basa'],
        'saheb': ['sab', 'saab', 'sahib'],
        'vali': ['wali', 'walee']
    },
    'same_door_duplicates_count': len(same_door_duplicates),
    'same_door_duplicates': same_door_duplicates,
    'cross_door_clusters_count': len(cross_door_clusters),
    'cross_door_clusters': cross_door_clusters
}

# Write files to data/
os.makedirs('data', exist_ok=True)

with open('data/official_ward08_voters.json', 'w', encoding='utf-8') as f:
    json.dump(voters, f, ensure_ascii=False, indent=2)

with open('data/official_ward08_households.json', 'w', encoding='utf-8') as f:
    json.dump(households, f, ensure_ascii=False, indent=2)

with open('data/official_ward08_localities.json', 'w', encoding='utf-8') as f:
    json.dump(localities, f, ensure_ascii=False, indent=2)

with open('data/official_ward08_search_aliases.json', 'w', encoding='utf-8') as f:
    json.dump(search_aliases, f, ensure_ascii=False, indent=2)

print("SUCCESS: Generated 4 JSON files in data/ directory:")
print("  - data/official_ward08_voters.json")
print("  - data/official_ward08_households.json")
print("  - data/official_ward08_localities.json")
print("  - data/official_ward08_search_aliases.json")
