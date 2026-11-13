"""Small, explicit review package. Sampling is workflow, not validation."""
def starter_items(bank):
    chosen=[]
    for band in ('A','B','C'):
        candidates=[i for i in bank['items'] if i['band']==band]
        families=set()
        for item in candidates:
            if item['family'] in families: continue
            chosen.append(item['id']); families.add(item['family'])
            if len(families)==2: break
    return chosen

def plan(bank, decisions, cases):
    return {'version':'phase-one-1','item_ids':starter_items(bank),
            'case_ids':[cases[0]['id']] if cases else [],
            'psychometric_decision_ids':[d['id'] for d in decisions if 'psychometrician' in d['role']][:2],
            'estimated_minutes':'۲۰ تا ۳۰ دقیقه؛ زمان پیشنهادی و قابل توقف',
            'purpose':'بررسی اولیهٔ فهم‌پذیری و حدود تفسیر؛ این بسته کل بانک را تأیید نمی‌کند.'}
