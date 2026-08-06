// 카드 정의.
// 텍스트는 전부 고양이 1인칭.
// stat: 판정에 참조하는 스탯. tone: 'good' | 'bad' | 'calm'
// outcomes: great / good / bad / terrible — 각각 { t: 결과 문장, mood: 표정, ...스탯변화 }
// choices: 좌/우 선택지. 확률에는 전혀 영향을 주지 않고 문장만 갈라진다.

export const GOOD_CARDS = [
  {
    id: 'fish', emoji: '🐟', title: '생선 발견', stat: 'abi', tone: 'good',
    text: '어물전 구석에 생선 한 마리가 떨어져 있다. 아무도 안 보는 것 같은데.',
    outcomes: {
      great: { t: '통째로 물고 도망쳤다! 오늘은 내가 이 골목의 왕이다.', mood: 'proud', hp: 18, exp: 8 },
      good: { t: '반쯤 뜯어먹었다. 배가 든든하다.', mood: 'happy', hp: 10 },
      bad: { t: '한 입 먹자마자 주인이 왔다. 아쉽다.', mood: 'sad', hp: 2 },
      terrible: { t: '가시가 목에 걸렸다. 아프다...', mood: 'hurt', hp: -3 },
    },
  },
  {
    id: 'adopt', emoji: '🏠', title: '좋은 집사에게 입양', stat: 'hap', tone: 'good',
    text: '어떤 사람이 나를 보고 웃는다. 손에 든 건... 츄르인가?',
    choices: [
      {
        label: '따라간다',
        outcomes: {
          great: { t: '따뜻한 방, 푹신한 방석, 그리고 무한한 츄르. 이게 천국인가.', mood: 'proud', hap: 25, hp: 10 },
          good: { t: '집이 생겼다. 나쁘지 않은 삶이다.', mood: 'happy', hap: 15 },
          bad: { t: '문턱까지 갔다가 그냥 돌아섰다. 왠지 무서웠다.', mood: 'sad', hap: 3 },
          terrible: { t: '며칠 만에 다시 길에 버려졌다. 사람은 믿는 게 아니었다.', mood: 'sad', hap: -5 },
        },
      },
      {
        label: '도망친다',
        outcomes: {
          great: { t: '도망친 골목 끝에서 더 좋은 사람을 만났다. 이게 운명이지.', mood: 'proud', hap: 25, hp: 10 },
          good: { t: '자유가 최고다. 그래도 츄르는 받아왔다.', mood: 'happy', hap: 15 },
          bad: { t: '도망치고 나서 조금 후회했다. 조금만.', mood: 'sad', hap: 3 },
          terrible: { t: '도망친 곳은 더 추운 골목이었다. 왜 도망쳤을까.', mood: 'sad', hap: -5 },
        },
      },
    ],
  },
  {
    id: 'friend', emoji: '😺', title: '친구 고양이 만남', stat: 'fri', tone: 'good',
    text: '담벼락 위에 나 말고 다른 고양이가 앉아 있다. 눈이 마주쳤다.',
    outcomes: {
      great: { t: '같이 낮잠까지 잤다. 평생 갈 친구다.', mood: 'proud', fri: 2, hap: 8 },
      good: { t: '코인사를 나눴다. 친구가 한 마리 늘었다.', mood: 'happy', fri: 1, hap: 4 },
      bad: { t: '서로 쳐다보다 각자 갈 길을 갔다.', mood: 'idle', hap: 1 },
      terrible: { t: '여긴 자기 구역이라며 하악질을 했다. 텃세가 심하다.', mood: 'scared', fri: -1 },
    },
  },
  {
    id: 'toy', emoji: '🪶', title: '희귀 장난감 발견', stat: 'abi', tone: 'good',
    text: '깃털이 달린 막대기다. 이건... 반드시 잡아야 한다.',
    outcomes: {
      great: { t: '공중에서 두 번 회전해서 낚아챘다. 나는 천재인가?', mood: 'proud', abi: 12, exp: 10 },
      good: { t: '한참 놀았다. 몸이 가벼워진 기분이다.', mood: 'happy', abi: 6 },
      bad: { t: '몇 번 툭툭 치다 흥미를 잃었다.', mood: 'idle', abi: 2 },
      terrible: { t: '너무 신나서 구르다 벽에 부딪혔다.', mood: 'hurt', abi: 1, hp: -2 },
    },
  },
  {
    id: 'sun', emoji: '🌞', title: '따뜻한 햇볕', stat: 'hap', tone: 'good',
    text: '창가에 햇볕이 고여 있다. 저기 딱 내 몸 크기다.',
    outcomes: {
      great: { t: '세 시간을 잤다. 인생에 이보다 완벽한 순간은 없다.', mood: 'proud', hap: 12, hp: 5 },
      good: { t: '배를 뒤집고 늘어졌다. 좋다.', mood: 'happy', hap: 7 },
      bad: { t: '눕자마자 그늘이 졌다. 해가 야속하다.', mood: 'sad', hap: 3 },
      terrible: { t: '너무 오래 있었나. 머리가 어지럽다.', mood: 'hurt', hp: -4 },
    },
  },
  {
    id: 'snack', emoji: '🍗', title: '맛있는 간식 획득', stat: 'hp', tone: 'good',
    text: '어디선가 고소한 냄새가 난다. 코가 저절로 움직인다.',
    outcomes: {
      great: { t: '통닭 다리를 통째로 얻었다. 오늘은 잔칫날이다.', mood: 'proud', hp: 15, hap: 6 },
      good: { t: '배부르게 먹었다. 세상이 아름답다.', mood: 'happy', hp: 9 },
      bad: { t: '냄새만 실컷 맡았다. 더 배고파졌다.', mood: 'sad', hp: 3 },
      terrible: { t: '상한 거였나 보다. 속이 안 좋다...', mood: 'hurt', hp: -5 },
    },
  },
  {
    id: 'butterfly', emoji: '🦋', title: '나비 사냥', stat: 'abi', tone: 'good',
    text: '노란 나비가 눈앞에서 팔랑거린다. 사냥 본능이 깨어난다.',
    choices: [
      {
        label: '덮친다',
        outcomes: {
          great: { t: '단번에 앞발로 잡았다! ...그리고 놓아줬다. 나는 관대하니까.', mood: 'proud', exp: 20, abi: 5 },
          good: { t: '한참을 쫓아다녔다. 사냥은 못 했지만 재밌었다.', mood: 'happy', exp: 12 },
          bad: { t: '나비는 이미 저 멀리 날아갔다.', mood: 'sad', exp: 4 },
          terrible: { t: '덤불로 뛰어들다 가시에 긁혔다.', mood: 'hurt', hp: -4 },
        },
      },
      {
        label: '지켜본다',
        outcomes: {
          great: { t: '가만히 있었더니 나비가 내 코에 앉았다. 이런 날도 있구나.', mood: 'proud', exp: 20, abi: 5 },
          good: { t: '꼬리만 살랑이며 오래 구경했다. 이것도 사냥이다.', mood: 'happy', exp: 12 },
          bad: { t: '보다가 그냥 잠들었다.', mood: 'idle', exp: 4 },
          terrible: { t: '넋 놓고 보다가 발을 헛디뎠다.', mood: 'hurt', hp: -4 },
        },
      },
    ],
  },
  {
    id: 'treasure', emoji: '💰', title: '보물 발견', stat: 'abi', tone: 'good',
    text: '하수구 틈에서 뭔가 반짝인다. 사람들이 좋아하는 그거 같은데.',
    outcomes: {
      great: { t: '금빛 나는 걸 물고 나왔다. 값어치는 모르지만 기분은 최고다.', mood: 'proud', score: 300, hap: 10 },
      good: { t: '동전 몇 개를 굴려 꺼냈다. 왠지 뿌듯하다.', mood: 'happy', score: 150 },
      bad: { t: '발이 안 닿는다. 포기했다.', mood: 'sad', score: 40 },
      terrible: { t: '발만 하수구 물에 젖었다. 최악이다.', mood: 'sad', hap: -3 },
    },
  },
];

export const BAD_CARDS = [
  {
    id: 'rain', emoji: '🌧', title: '비 맞음', stat: 'hp', tone: 'bad',
    text: '하늘이 어두워지더니 빗방울이 떨어진다. 털이 젖는 건 정말 싫은데.',
    outcomes: {
      great: { t: '처마 밑 완벽한 자리를 찾았다. 비 오는 날 구경도 낭만이지.', mood: 'proud', exp: 8 },
      good: { t: '살짝 젖은 정도로 넘어갔다.', mood: 'idle', hp: -2 },
      bad: { t: '흠뻑 젖었다. 몸이 무겁고 춥다.', mood: 'sad', hp: -8, hap: -5 },
      terrible: { t: '밤새 비를 맞았다. 이빨이 부딪히도록 떨었다.', mood: 'hurt', hp: -14, hap: -8 },
    },
  },
  {
    id: 'dog', emoji: '🐕', title: '개에게 쫓김', stat: 'abi', tone: 'bad',
    text: '큰 개가 나를 노려본다. 목줄이... 없다.',
    choices: [
      {
        label: '도망친다',
        outcomes: {
          great: { t: '담을 세 번 넘어 완벽하게 따돌렸다. 다리가 이렇게 빨랐나?', mood: 'proud', exp: 18, abi: 4 },
          good: { t: '간신히 나무 위로 올라갔다. 심장이 뛴다.', mood: 'scared', hp: -3 },
          bad: { t: '한참 쫓기다 겨우 숨었다. 발바닥이 아프다.', mood: 'hurt', hp: -10 },
          terrible: { t: '넘어졌다. 다리를 물렸다...', mood: 'hurt', hp: -18 },
        },
      },
      {
        label: '맞선다',
        outcomes: {
          great: { t: '등을 세우고 하악질했더니 개가 먼저 물러섰다. 내가 이겼다.', mood: 'proud', exp: 18, abi: 4 },
          good: { t: '노려보는 사이 주인이 개를 데려갔다.', mood: 'scared', hp: -3 },
          bad: { t: '허세는 통하지 않았다. 도망치다 긁혔다.', mood: 'hurt', hp: -10 },
          terrible: { t: '괜히 맞섰다. 온몸이 아프다...', mood: 'hurt', hp: -18 },
        },
      },
    ],
  },
  {
    id: 'car', emoji: '🚗', title: '자동차', stat: 'abi', tone: 'bad',
    text: '길을 건너려는데 커다란 쇳덩이가 굉음을 내며 달려온다.',
    outcomes: {
      great: { t: '타이밍을 완벽하게 재서 건넜다. 세상은 나를 못 잡는다.', mood: 'proud', exp: 12 },
      good: { t: '깜짝 놀라 뒤로 물러섰다. 심장이 쿵쾅거린다.', mood: 'scared', hap: -3 },
      bad: { t: '경적 소리에 얼어붙었다. 한참을 못 움직였다.', mood: 'scared', hp: -8, hap: -6 },
      terrible: { t: '피하다 벽에 부딪혔다. 온몸이 얼얼하다...', mood: 'hurt', hp: -20 },
    },
  },
  {
    id: 'winter', emoji: '🥶', title: '겨울 추위', stat: 'hp', tone: 'bad',
    text: '숨을 쉴 때마다 하얀 김이 난다. 발이 시리다.',
    outcomes: {
      great: { t: '아직 따뜻한 자동차 보닛을 찾았다. 겨울도 살 만하다.', mood: 'happy', hp: 4 },
      good: { t: '몸을 동그랗게 말고 버텼다.', mood: 'idle', hp: -4 },
      bad: { t: '밤새 떨었다. 이런 밤이 몇 번이나 남았을까.', mood: 'sad', hp: -12 },
      terrible: { t: '눈밭에서 길을 잃었다. 몸이 말을 안 듣는다...', mood: 'hurt', hp: -18, hap: -8 },
    },
  },
  {
    id: 'hunger', emoji: '🍽', title: '먹이를 못 찾음', stat: 'abi', tone: 'bad',
    text: '오늘도 빈 그릇이다. 배에서 소리가 난다.',
    outcomes: {
      great: { t: '포기하려던 순간 누군가 밥을 놓고 갔다. 세상엔 좋은 사람도 있다.', mood: 'happy', hp: 8 },
      good: { t: '풀이라도 뜯었다. 배는 안 차지만 견딜 만하다.', mood: 'idle', hp: -4 },
      bad: { t: '하루 종일 아무것도 못 먹었다.', mood: 'sad', hp: -10 },
      terrible: { t: '이틀째다. 걷는 것도 힘들다...', mood: 'hurt', hp: -16 },
    },
  },
  {
    id: 'fight', emoji: '🤕', title: '싸움', stat: 'fri', tone: 'bad',
    text: '덩치 큰 고양이가 내 밥그릇 앞을 막아섰다.',
    outcomes: {
      great: { t: '한 발 물러서는 척하다 기선을 제압했다. 이 구역은 내 거다.', mood: 'proud', exp: 15, abi: 5 },
      good: { t: '적당히 으르렁대다 서로 물러났다.', mood: 'scared', hp: -5 },
      bad: { t: '귀가 찢어졌다. 밥그릇도 뺏겼다.', mood: 'hurt', hp: -12, abi: -3 },
      terrible: { t: '크게 다쳤다. 한동안 못 움직일 것 같다...', mood: 'hurt', hp: -20 },
    },
  },
  {
    id: 'sick', emoji: '🦠', title: '병', stat: 'hp', tone: 'bad',
    text: '눈이 자꾸 감긴다. 코가 막히고 몸이 뜨겁다.',
    outcomes: {
      great: { t: '하루 푹 자고 일어나니 씻은 듯 나았다. 역시 잠이 보약이다.', mood: 'happy', hp: -2 },
      good: { t: '며칠 앓다가 나아졌다.', mood: 'sad', hp: -8 },
      bad: { t: '기침이 멎지 않는다. 몸이 무겁다.', mood: 'hurt', hp: -15, hap: -6 },
      terrible: { t: '일어설 수가 없다. 이대로 끝인 걸까...', mood: 'hurt', hp: -22 },
    },
  },
  {
    id: 'broom', emoji: '🧹', title: '사람에게 쫓겨남', stat: 'hap', tone: 'bad',
    text: '겨우 자리를 잡았는데 누가 빗자루를 들고 나온다.',
    outcomes: {
      great: { t: '가게 주인이 마음을 바꿔 밥까지 줬다. 나는 귀여우니까.', mood: 'proud', exp: 8 },
      good: { t: '조용히 자리를 옮겼다. 익숙한 일이다.', mood: 'idle', hap: -4 },
      bad: { t: '고함소리에 놀라 도망쳤다. 왜 나를 싫어할까.', mood: 'sad', hap: -10, hp: -4 },
      terrible: { t: '물벼락을 맞고 쫓겨났다. 서럽다.', mood: 'sad', hap: -15, hp: -8 },
    },
  },
  {
    id: 'bird', emoji: '🦅', title: '큰 새의 위협', stat: 'abi', tone: 'bad',
    text: '하늘에 커다란 그림자가 돈다. 나를 보고 있는 것 같다.',
    outcomes: {
      great: { t: '그림자가 지나갈 때까지 완벽하게 숨었다. 나는 그림자의 일부다.', mood: 'proud', exp: 20 },
      good: { t: '재빨리 차 밑으로 숨었다. 심장이 터질 것 같다.', mood: 'scared', hp: -4 },
      bad: { t: '발톱이 등을 스쳤다. 하늘이 무섭다.', mood: 'hurt', hp: -12 },
      terrible: { t: '높이 들렸다가 떨어졌다. 온몸이 부서질 것 같다...', mood: 'hurt', hp: -22 },
    },
  },
  {
    id: 'farewell', emoji: '😿', title: '이별', stat: 'fri', tone: 'bad',
    text: '늘 같이 다니던 친구가 며칠째 보이지 않는다.',
    outcomes: {
      great: { t: '골목 끝에서 다시 만났다. 우리는 또 같이 걷는다.', mood: 'happy', hap: 5 },
      good: { t: '어디선가 잘 지내고 있겠지. 그렇게 믿기로 했다.', mood: 'sad', hap: -5 },
      bad: { t: '기다리던 자리에 아무도 오지 않았다.', mood: 'sad', fri: -1, hap: -10 },
      terrible: { t: '다시는 볼 수 없다는 걸 알아버렸다.', mood: 'sad', fri: -2, hap: -16 },
    },
  },
];

// 판정 없는 연출 카드. 결과는 항상 'calm'.
export const CALM_CARDS = [
  { id: 'night', emoji: '🌙', title: '밤 산책', text: '아무도 없는 새벽 골목. 이 시간은 온전히 내 것이다.', calm: { hap: 3, exp: 2 } },
  { id: 'box', emoji: '📦', title: '상자', text: '빈 상자를 발견했다. 들어가야 한다. 이유는 없다.', calm: { hap: 5 } },
  { id: 'yarn', emoji: '🧵', title: '실뭉치', text: '굴러다니는 실뭉치. 앞발이 저절로 나간다.', calm: { hap: 4, abi: 2 } },
  { id: 'paw', emoji: '🐾', title: '발자국', text: '눈 위에 내 발자국이 길게 남았다. 꽤 멀리 왔구나.', calm: { exp: 5 } },
  { id: 'window', emoji: '🚪', title: '창밖 구경', text: '유리 너머로 사람들이 바쁘게 지나간다. 다들 어디로 가는 걸까.', calm: { hap: 2, exp: 3 } },
];

// 특수 카드
export const EXTEND_CARD = {
  id: 'extend', emoji: '🧶', title: '인생 연장', special: 'extend',
  text: '아직 못 가본 골목이 남아 있다. 조금 더 걸어볼까?',
  result: '남은 인생이 5장 늘었다!',
};

export const CLOVER_CARD = {
  id: 'clover', emoji: '🍀', title: '행운의 클로버', special: 'clover',
  text: '네 잎이다. 이런 건 처음 본다.',
  result: '앞으로 3장 동안 최악의 일은 일어나지 않는다.',
};

export const TRIAL_CARD = {
  id: 'trial', emoji: '🐈‍⬛', title: '검은 고양이의 시련', stat: 'abi', tone: 'bad', trial: true,
  text: '검은 고양이가 길을 막고 나를 빤히 본다. 시험받는 기분이다.',
  outcomes: {
    great: { t: '눈을 피하지 않았다. 검은 고양이가 고개를 끄덕이고 사라졌다.', mood: 'proud', score: 600, exp: 30 },
    good: { t: '조심스럽게 옆으로 지나갔다. 아무 일도 없었다.', mood: 'idle', exp: 5 },
    bad: { t: '겁을 먹고 도망쳤다. 뒤통수가 따갑다.', mood: 'scared', hap: -6 },
    terrible: { t: '검은 고양이의 눈을 본 순간, 온몸에서 힘이 빠졌다...', mood: 'hurt', hpHalf: true },
  },
};
