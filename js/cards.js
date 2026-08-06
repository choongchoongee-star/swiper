// 카드 정의. 텍스트는 전부 고양이 1인칭.
// stat: 판정에 참조하는 스탯. tone: 'good' | 'bad' | 'calm'
// outcomes: great / good / bad / terrible — { t, mood, ...스탯변화 }
//   t 가 배열이면 같은 카드가 다시 나왔을 때 아직 안 쓴 문장을 골라 쓴다.
//   대성공·대실패는 반드시 두 개 이상의 문장을 갖는다.
// choices: 좌/우 선택지. 확률에는 전혀 영향을 주지 않고 문장만 갈라진다.

export const GOOD_CARDS = [
  {
    id: 'fish', emoji: '🐟', title: '생선 발견', stat: 'abi', tone: 'good',
    text: '어물전 구석에 생선 한 마리가 떨어져 있다. 아무도 안 보는 것 같은데.',
    outcomes: {
      great: { t: ['통째로 물고 도망쳤다! 오늘은 내가 이 골목의 왕이다.', '주인이 등을 돌린 3초. 그 3초면 충분했다.'], mood: 'proud', hp: 18, exp: 8 },
      good: { t: '반쯤 뜯어먹었다. 배가 든든하다.', mood: 'happy', hp: 10 },
      bad: { t: '한 입 먹자마자 주인이 왔다. 아쉽다.', mood: 'sad', hp: 2 },
      terrible: { t: ['가시가 목에 걸렸다. 아프다...', '상한 거였다. 하루 종일 속이 뒤집혔다.'], mood: 'hurt', hp: -3 },
    },
  },
  {
    id: 'friend', emoji: '😺', title: '친구 고양이 만남', stat: 'fri', tone: 'good',
    text: '담벼락 위에 나 말고 다른 고양이가 앉아 있다. 눈이 마주쳤다.',
    outcomes: {
      great: { t: ['같이 낮잠까지 잤다. 평생 갈 친구다.', '서로 그루밍을 해줬다. 이런 사이가 되는 데 오래 걸리지 않았다.'], mood: 'proud', fri: 2, hap: 8 },
      good: { t: '코인사를 나눴다. 친구가 한 마리 늘었다.', mood: 'happy', fri: 1, hap: 4 },
      bad: { t: '서로 쳐다보다 각자 갈 길을 갔다.', mood: 'idle', hap: 1 },
      terrible: { t: ['여긴 자기 구역이라며 하악질을 했다. 텃세가 심하다.', '다가갔더니 발톱이 날아왔다. 코끝이 화끈거린다.'], mood: 'scared', fri: -1 },
    },
  },
  {
    id: 'toy', emoji: '🪶', title: '희귀 장난감 발견', stat: 'abi', tone: 'good',
    text: '깃털이 달린 막대기다. 이건... 반드시 잡아야 한다.',
    outcomes: {
      great: { t: ['공중에서 두 번 회전해서 낚아챘다. 나는 천재인가?', '깃털이 닿기도 전에 앞발이 먼저 나갔다. 몸이 기억한다.'], mood: 'proud', abi: 12, exp: 10 },
      good: { t: '한참 놀았다. 몸이 가벼워진 기분이다.', mood: 'happy', abi: 6 },
      bad: { t: '몇 번 툭툭 치다 흥미를 잃었다.', mood: 'idle', abi: 2 },
      terrible: { t: ['너무 신나서 구르다 벽에 부딪혔다.', '깃털을 삼킬 뻔했다. 한참을 캑캑거렸다.'], mood: 'hurt', abi: 1, hp: -2 },
    },
  },
  {
    id: 'sun', emoji: '🌞', title: '따뜻한 햇볕', stat: 'hap', tone: 'good',
    text: '담장에 햇볕이 고여 있다. 저기 딱 내 몸 크기다.',
    outcomes: {
      great: { t: ['세 시간을 잤다. 인생에 이보다 완벽한 순간은 없다.', '햇볕이 지나가는 만큼 나도 조금씩 움직였다. 완벽한 하루였다.'], mood: 'proud', hap: 12, hp: 5 },
      good: { t: '배를 뒤집고 늘어졌다. 좋다.', mood: 'happy', hap: 7 },
      bad: { t: '눕자마자 그늘이 졌다. 해가 야속하다.', mood: 'sad', hap: 3 },
      terrible: { t: ['너무 오래 있었나. 머리가 어지럽다.', '달아오른 양철 지붕이었다. 발바닥을 데었다.'], mood: 'hurt', hp: -4 },
    },
  },
  {
    id: 'snack', emoji: '🍗', title: '맛있는 간식', stat: 'hp', tone: 'good',
    text: '어디선가 고소한 냄새가 난다. 코가 저절로 움직인다.',
    outcomes: {
      great: { t: ['통닭 다리를 통째로 얻었다. 오늘은 잔칫날이다.', '누가 통조림을 통째로 따줬다. 이 사람은 천사다.'], mood: 'proud', hp: 15, hap: 6 },
      good: { t: '배부르게 먹었다. 세상이 아름답다.', mood: 'happy', hp: 9 },
      bad: { t: '냄새만 실컷 맡았다. 더 배고파졌다.', mood: 'sad', hp: 3 },
      terrible: { t: ['상한 거였나 보다. 속이 안 좋다...', '뼛조각이 잇몸에 박혔다. 며칠은 못 씹겠다.'], mood: 'hurt', hp: -5 },
    },
  },
  {
    id: 'butterfly', emoji: '🦋', title: '나비 사냥', stat: 'abi', tone: 'good',
    text: '노란 나비가 눈앞에서 팔랑거린다. 사냥 본능이 깨어난다.',
    choices: [
      {
        label: '덮친다',
        outcomes: {
          great: { t: ['단번에 앞발로 잡았다! ...그리고 놓아줬다. 나는 관대하니까.', '두 발로 서서 낚아챘다. 오늘의 나는 완벽했다.'], mood: 'proud', exp: 20, abi: 5 },
          good: { t: '한참을 쫓아다녔다. 사냥은 못 했지만 재밌었다.', mood: 'happy', exp: 12 },
          bad: { t: '나비는 이미 저 멀리 날아갔다.', mood: 'sad', exp: 4 },
          terrible: { t: ['덤불로 뛰어들다 가시에 긁혔다.', '착지에 실패해 옆구리를 찧었다.'], mood: 'hurt', hp: -4 },
        },
      },
      {
        label: '지켜본다',
        outcomes: {
          great: { t: ['가만히 있었더니 나비가 내 코에 앉았다. 이런 날도 있구나.', '숨죽인 채 한참을 봤다. 세상이 아주 조용해졌다.'], mood: 'proud', exp: 20, abi: 5 },
          good: { t: '꼬리만 살랑이며 오래 구경했다. 이것도 사냥이다.', mood: 'happy', exp: 12 },
          bad: { t: '보다가 그냥 잠들었다.', mood: 'idle', exp: 4 },
          terrible: { t: ['넋 놓고 보다가 발을 헛디뎠다.', '한눈판 사이 뒤에서 누가 나를 덮쳤다.'], mood: 'hurt', hp: -4 },
        },
      },
    ],
  },
  {
    id: 'treasure', emoji: '💰', title: '보물 발견', stat: 'abi', tone: 'good',
    text: '하수구 틈에서 뭔가 반짝인다. 사람들이 좋아하는 그거 같은데.',
    outcomes: {
      great: { t: ['금빛 나는 걸 물고 나왔다. 값어치는 모르지만 기분은 최고다.', '반짝이는 걸 한 움큼 긁어냈다. 내 비밀 창고가 두둑해졌다.'], mood: 'proud', score: 300, hap: 10 },
      good: { t: '동전 몇 개를 굴려 꺼냈다. 왠지 뿌듯하다.', mood: 'happy', score: 150 },
      bad: { t: '발이 안 닿는다. 포기했다.', mood: 'sad', score: 40 },
      terrible: { t: ['발만 하수구 물에 젖었다. 최악이다.', '앞발이 틈에 끼었다. 빼내느라 한참 걸렸다.'], mood: 'sad', hap: -3 },
    },
  },
  {
    id: 'feeder', emoji: '🥫', title: '급식소 발견', stat: 'abi', tone: 'good',
    text: '담벼락 밑에 그릇이 놓여 있다. 누가 매일 채워주는 모양이다.',
    outcomes: {
      great: { t: ['갓 채운 사료였다. 이 골목의 비밀 식당을 알아버렸다.', '아무도 없을 때 혼자 실컷 먹었다. 이런 행운이.'], mood: 'proud', hp: 16, hap: 6 },
      good: { t: '남은 사료를 긁어먹었다. 오늘은 굶지 않는다.', mood: 'happy', hp: 10 },
      bad: { t: '이미 누가 다 먹었다. 그릇만 핥았다.', mood: 'sad', hp: 2 },
      terrible: { t: ['먼저 온 고양이가 자리를 안 비켜준다. 그냥 돌아섰다.', '그릇에 빗물만 고여 있었다. 헛걸음이다.'], mood: 'sad', hap: -3 },
    },
  },
  {
    id: 'churu', emoji: '🍡', title: '츄르 아저씨', stat: 'hap', tone: 'good',
    text: '매일 같은 시간에 오는 사람이 있다. 오늘도 주머니에서 뭔가 꺼낸다.',
    outcomes: {
      great: { t: ['두 개나 받았다. 이 사람은 내 인생 최고의 발견이다.', '이름을 불러주며 웃었다. 나에게 이름이 생겼다.'], mood: 'proud', hap: 18, hp: 8 },
      good: { t: '하나 얻어먹었다. 오늘도 좋은 날이다.', mood: 'happy', hap: 10, hp: 4 },
      bad: { t: '오늘은 그냥 지나갔다. 바쁜가 보다.', mood: 'sad', hap: 2 },
      terrible: { t: ['며칠째 오지 않는다. 무슨 일이 있는 걸까.', '다른 고양이한테만 주고 갔다. 서운하다.'], mood: 'sad', hap: -8 },
    },
  },
  {
    id: 'roof', emoji: '🏚', title: '지붕 등반', stat: 'abi', tone: 'good',
    text: '저 위에 올라가면 동네가 다 보일 것 같다.',
    outcomes: {
      great: { t: ['가장 높은 곳에 올랐다. 여기서 보니 세상이 내 것 같다.', '한 번에 세 칸을 뛰어올랐다. 내 다리가 이렇게 좋았나.'], mood: 'proud', exp: 18, abi: 8 },
      good: { t: '지붕 끝까지 올라가 한참 앉아 있었다.', mood: 'happy', exp: 10, abi: 3 },
      bad: { t: '중간에 미끄러져 내려왔다. 다음엔 되겠지.', mood: 'sad', exp: 3 },
      terrible: { t: ['떨어졌다. 착지는 했지만 다리가 후들거린다.', '올라갔다가 못 내려왔다. 밤새 지붕 위에서 떨었다.'], mood: 'hurt', hp: -8 },
    },
  },
  {
    id: 'mouse', emoji: '🐭', title: '쥐 사냥', stat: 'abi', tone: 'good',
    text: '창고 뒤에서 부스럭 소리가 난다. 귀가 저절로 돌아간다.',
    outcomes: {
      great: { t: ['한 번에 잡았다. 역시 나는 사냥꾼의 피가 흐른다.', '숨죽여 기다린 보람이 있었다. 완벽한 한 방이었다.'], mood: 'proud', exp: 22, abi: 6, hp: 6 },
      good: { t: '놓쳤지만 꽤 근접했다. 감이 좋아지고 있다.', mood: 'happy', exp: 12, abi: 3 },
      bad: { t: '소리만 요란하고 아무것도 없었다.', mood: 'idle', exp: 3 },
      terrible: { t: ['쥐를 쫓다 창고 틈에 끼었다. 겨우 빠져나왔다.', '쥐가 오히려 나에게 달려들었다. 코를 물렸다.'], mood: 'hurt', hp: -7 },
    },
  },
  {
    id: 'kitten', emoji: '🐾', title: '아기 고양이', stat: 'fri', tone: 'good',
    text: '나보다 작은 녀석이 혼자 울고 있다. 배가 고픈 모양이다.',
    choices: [
      {
        label: '돌봐준다',
        outcomes: {
          great: { t: ['내 몫을 나눠줬다. 이제 이 녀석은 내 뒤를 졸졸 따라다닌다.', '밤새 곁을 지켜줬다. 아침에 녀석이 내 품에서 자고 있었다.'], mood: 'proud', fri: 2, hap: 14 },
          good: { t: '먹을 걸 조금 나눠줬다. 마음이 이상하게 따뜻하다.', mood: 'happy', fri: 1, hap: 7 },
          bad: { t: '다가갔더니 겁먹고 도망쳤다.', mood: 'sad', hap: 2 },
          terrible: { t: ['다음 날 그 자리에 아무도 없었다.', '내 먹이만 축났다. 녀석은 인사도 없이 사라졌다.'], mood: 'sad', hap: -8, hp: -4 },
        },
      },
      {
        label: '지나친다',
        outcomes: {
          great: { t: ['멀리서 지켜봤더니 어미가 돌아왔다. 잘된 일이다.', '내가 나설 일이 아니었다. 녀석은 씩씩하게 걸어갔다.'], mood: 'happy', fri: 2, hap: 14 },
          good: { t: '가던 길을 갔다. 각자의 삶이 있는 거니까.', mood: 'idle', fri: 1, hap: 7 },
          bad: { t: '자꾸 뒤가 돌아봐졌다.', mood: 'sad', hap: 2 },
          terrible: { t: ['울음소리가 밤새 귓가에 맴돌았다.', '다음 날 그 골목을 다시 지나가지 못했다.'], mood: 'sad', hap: -8, hp: -4 },
        },
      },
    ],
  },
  {
    id: 'blossom', emoji: '🌸', title: '벚꽃', stat: 'hap', tone: 'good',
    text: '분홍색 꽃잎이 눈처럼 떨어진다. 이게 다 어디서 오는 걸까.',
    outcomes: {
      great: { t: ['떨어지는 꽃잎을 전부 잡아보려다 하루가 갔다. 완벽한 봄이었다.', '꽃잎 위에 누웠다. 이런 침대는 처음이다.'], mood: 'proud', hap: 14, exp: 5 },
      good: { t: '꽃잎을 한참 쫓아다녔다. 봄은 좋다.', mood: 'happy', hap: 8 },
      bad: { t: '꽃잎이 코에 붙어 재채기만 나왔다.', mood: 'idle', hap: 2 },
      terrible: { t: ['꽃구경 나온 사람들에게 밟힐 뻔했다.', '꽃잎에 정신 팔려 길을 잃었다. 돌아오는 데 한참 걸렸다.'], mood: 'scared', hp: -4 },
    },
  },
  {
    id: 'lap', emoji: '🧓', title: '무릎', stat: 'hap', tone: 'good',
    text: '벤치에 앉은 사람이 무릎을 툭툭 친다. 올라오라는 뜻인가.',
    outcomes: {
      great: { t: ['무릎 위에서 골골거리며 잤다. 사람도 나도 행복했다.', '한참을 쓰다듬어줬다. 이런 손길은 처음이었다.'], mood: 'proud', hap: 16, hp: 6 },
      good: { t: '잠깐 앉아 있었다. 따뜻했다.', mood: 'happy', hap: 9 },
      bad: { t: '망설이는 사이 사람이 일어나 가버렸다.', mood: 'sad', hap: 2 },
      terrible: { t: ['올라갔더니 깜짝 놀라 나를 밀쳐냈다.', '사진만 잔뜩 찍고 가버렸다. 나는 구경거리였나.'], mood: 'sad', hap: -7 },
    },
  },
  {
    id: 'shelter', emoji: '🏕', title: '겨울집 발견', stat: 'hp', tone: 'good',
    text: '스티로폼 상자에 담요가 깔려 있다. 누가 일부러 놓아둔 것 같다.',
    outcomes: {
      great: { t: ['안이 놀랍도록 따뜻하다. 올겨울은 살았다.', '나만 아는 자리다. 밤마다 여기로 돌아오면 된다.'], mood: 'proud', hp: 20, hap: 10 },
      good: { t: '하룻밤 편히 잤다. 오랜만이다.', mood: 'happy', hp: 12, hap: 4 },
      bad: { t: '이미 다른 고양이가 차지했다. 다음을 기약한다.', mood: 'sad', hp: 2 },
      terrible: { t: ['아침에 상자가 치워져 있었다. 누군가 버린 것이다.', '들어가자마자 물이 새어 담요가 다 젖었다.'], mood: 'sad', hp: -6, hap: -6 },
    },
  },
  {
    id: 'bonnet', emoji: '🚙', title: '자동차 보닛', stat: 'hp', tone: 'good',
    text: '방금 세워둔 차의 보닛에서 온기가 올라온다.',
    outcomes: {
      great: { t: ['아침까지 따뜻했다. 이 동네 최고의 침대다.', '주인이 나를 보고도 그냥 웃으며 지나갔다. 오늘은 여기가 내 집이다.'], mood: 'proud', hp: 14, hap: 8 },
      good: { t: '몸을 녹였다. 겨울밤이 조금 짧아졌다.', mood: 'happy', hp: 9 },
      bad: { t: '올라가자마자 식어버렸다.', mood: 'idle', hp: 2 },
      terrible: { t: ['갑자기 차가 움직였다. 뛰어내리느라 혼났다.', '경적이 바로 밑에서 울렸다. 심장이 멎는 줄 알았다.'], mood: 'scared', hp: -8 },
    },
  },
  {
    id: 'name', emoji: '📛', title: '이름을 얻다', stat: 'hap', tone: 'good',
    text: '가게 아주머니가 나를 부르는 소리가 들린다. 저게 내 이름인가?',
    outcomes: {
      great: { t: ['동네 사람들이 모두 그 이름으로 나를 부른다. 나는 이 골목의 일원이다.', '가게 앞에 내 이름이 적힌 그릇이 생겼다.'], mood: 'proud', hap: 18, fri: 1 },
      good: { t: '누군가 나를 알아본다는 건 나쁘지 않다.', mood: 'happy', hap: 10 },
      bad: { t: '다른 고양이를 부르는 소리였다.', mood: 'sad', hap: 1 },
      terrible: { t: ['이름 대신 욕을 들었다. 내가 뭘 했다고.', '부르는 소리에 갔더니 쫓아내려는 것이었다.'], mood: 'sad', hap: -9 },
    },
  },
  {
    id: 'bin', emoji: '🗑', title: '쓰레기통 탐색', stat: 'abi', tone: 'good',
    text: '식당 뒤 쓰레기통. 냄새로 보아 오늘은 뭔가 있다.',
    outcomes: {
      great: { t: ['생선 대가리를 통째로 건졌다. 오늘 저녁은 성찬이다.', '뚜껑을 여는 요령을 터득했다. 이건 평생 써먹을 기술이다.'], mood: 'proud', hp: 14, abi: 6, exp: 6 },
      good: { t: '먹을 만한 걸 조금 찾았다.', mood: 'happy', hp: 8 },
      bad: { t: '비닐만 잔뜩 헤집었다. 아무것도 없다.', mood: 'sad', hp: 1 },
      terrible: { t: ['쓰레기통이 통째로 넘어졌다. 사람이 뛰쳐나왔다.', '유리 조각을 밟았다. 발바닥에서 피가 난다.'], mood: 'hurt', hp: -9 },
    },
  },
  {
    id: 'sparrow', emoji: '🐦', title: '참새 사냥', stat: 'abi', tone: 'good',
    text: '전깃줄 밑에 참새들이 내려앉았다. 아직 나를 못 봤다.',
    outcomes: {
      great: { t: ['숨소리도 없이 다가가 덮쳤다. 사냥꾼의 자존심을 지켰다.', '한 마리가 내 앞으로 떨어졌다. 하늘이 준 선물이다.'], mood: 'proud', exp: 20, abi: 7 },
      good: { t: '깃털 하나를 얻었다. 다음엔 잡을 수 있다.', mood: 'happy', exp: 11 },
      bad: { t: '내가 움직이기도 전에 다 날아갔다.', mood: 'sad', exp: 3 },
      terrible: { t: ['담장에서 뛰어내리다 발목을 삐었다.', '참새 떼가 오히려 나에게 달려들었다. 머리를 쪼였다.'], mood: 'hurt', hp: -6 },
    },
  },
  {
    id: 'firstsnow', emoji: '❄️', title: '첫눈', stat: 'hap', tone: 'good',
    text: '하늘에서 하얀 게 떨어진다. 잡으려니 손에서 사라진다.',
    outcomes: {
      great: { t: ['눈밭에서 실컷 뒹굴었다. 이런 날은 일 년에 한 번뿐이다.', '눈송이를 앞발로 받아냈다. 세상이 조용하고 아름다웠다.'], mood: 'proud', hap: 14, exp: 6 },
      good: { t: '한참 눈을 구경했다. 이상하게 마음이 놓인다.', mood: 'happy', hap: 8 },
      bad: { t: '예쁘긴 한데 발이 시리다.', mood: 'idle', hap: 2, hp: -2 },
      terrible: { t: ['눈에 젖은 털이 얼어붙었다. 몸이 덜덜 떨린다.', '눈밭에 발자국을 남기며 걷다 길을 잃었다.'], mood: 'hurt', hp: -9 },
    },
  },
  {
    id: 'window', emoji: '🪟', title: '어항 구경', stat: 'abi', tone: 'good',
    text: '유리 너머로 물고기가 헤엄친다. 잡을 수는 없지만 눈은 즐겁다.',
    outcomes: {
      great: { t: ['하루 종일 봤다. 이건 내 전용 텔레비전이다.', '집주인이 창가에 방석까지 놓아줬다. 지정석이 생겼다.'], mood: 'proud', hap: 12, exp: 8 },
      good: { t: '앞발로 유리를 톡톡 쳐봤다. 재밌다.', mood: 'happy', hap: 6 },
      bad: { t: '커튼이 쳐졌다. 오늘 방송은 끝인가 보다.', mood: 'sad', hap: 1 },
      terrible: { t: ['너무 세게 뛰어올라 유리에 얼굴을 박았다.', '집주인이 소리를 질렀다. 도망치다 화분을 엎었다.'], mood: 'hurt', hp: -5 },
    },
  },
  {
    id: 'rooftop', emoji: '🌇', title: '노을', stat: 'hap', tone: 'good',
    text: '지붕 끝에 앉으니 하늘이 온통 주황색이다.',
    outcomes: {
      great: { t: ['해가 완전히 질 때까지 앉아 있었다. 오늘 하루가 통째로 좋았다.', '옆에 친구가 와서 같이 앉았다. 아무 말도 필요 없었다.'], mood: 'proud', hap: 13, exp: 8 },
      good: { t: '한참 노을을 봤다. 내일도 이런 하루면 좋겠다.', mood: 'happy', hap: 7 },
      bad: { t: '금세 어두워졌다. 밤은 늘 빨리 온다.', mood: 'idle', hap: 2 },
      terrible: { t: ['넋 놓고 보다가 지붕에서 미끄러졌다.', '어두워져서 내려오는 길을 못 찾았다.'], mood: 'scared', hp: -6 },
    },
  },
];

export const BAD_CARDS = [
  {
    id: 'rain', emoji: '🌧', title: '비 맞음', stat: 'hp', tone: 'bad',
    text: '하늘이 어두워지더니 빗방울이 떨어진다. 털이 젖는 건 정말 싫은데.',
    outcomes: {
      great: { t: ['처마 밑 완벽한 자리를 찾았다. 비 오는 날 구경도 낭만이지.', '빈 상자 안으로 쏙 들어갔다. 빗소리가 자장가처럼 들린다.'], mood: 'proud', exp: 8 },
      good: { t: '살짝 젖은 정도로 넘어갔다.', mood: 'idle', hp: -2 },
      bad: { t: '흠뻑 젖었다. 몸이 무겁고 춥다.', mood: 'sad', hp: -8, hap: -5 },
      terrible: { t: ['밤새 비를 맞았다. 이빨이 부딪히도록 떨었다.', '빗물이 잠자리까지 들이쳤다. 앉을 자리 하나 없었다.'], mood: 'hurt', hp: -14, hap: -8 },
    },
  },
  {
    id: 'dog', emoji: '🐕', title: '개에게 쫓김', stat: 'abi', tone: 'bad',
    text: '큰 개가 나를 노려본다. 목줄이... 없다.',
    choices: [
      {
        label: '도망친다',
        outcomes: {
          great: { t: ['담을 세 번 넘어 완벽하게 따돌렸다. 다리가 이렇게 빨랐나?', '좁은 틈으로 쏙 들어갔다. 개는 들어올 수 없는 곳이다.'], mood: 'proud', exp: 18, abi: 4 },
          good: { t: '간신히 나무 위로 올라갔다. 심장이 뛴다.', mood: 'scared', hp: -3 },
          bad: { t: '한참 쫓기다 겨우 숨었다. 발바닥이 아프다.', mood: 'hurt', hp: -10 },
          terrible: { t: ['넘어졌다. 다리를 물렸다...', '막다른 골목이었다. 그 뒤는 기억나지 않는다.'], mood: 'hurt', hp: -18 },
        },
      },
      {
        label: '맞선다',
        outcomes: {
          great: { t: ['등을 세우고 하악질했더니 개가 먼저 물러섰다. 내가 이겼다.', '코를 정확히 한 대 쳤다. 개가 깨갱거리며 달아났다.'], mood: 'proud', exp: 18, abi: 4 },
          good: { t: '노려보는 사이 주인이 개를 데려갔다.', mood: 'scared', hp: -3 },
          bad: { t: '허세는 통하지 않았다. 도망치다 긁혔다.', mood: 'hurt', hp: -10 },
          terrible: { t: ['괜히 맞섰다. 온몸이 아프다...', '덩치 차이는 어쩔 수 없었다. 한참을 일어나지 못했다.'], mood: 'hurt', hp: -18 },
        },
      },
    ],
  },
  {
    id: 'car', emoji: '🚗', title: '자동차', stat: 'abi', tone: 'bad',
    text: '길을 건너려는데 커다란 쇳덩이가 굉음을 내며 달려온다.',
    outcomes: {
      great: { t: ['타이밍을 완벽하게 재서 건넜다. 세상은 나를 못 잡는다.', '차 밑으로 미끄러져 들어가 그대로 지나 보냈다.'], mood: 'proud', exp: 12 },
      good: { t: '깜짝 놀라 뒤로 물러섰다. 심장이 쿵쾅거린다.', mood: 'scared', hap: -3 },
      bad: { t: '경적 소리에 얼어붙었다. 한참을 못 움직였다.', mood: 'scared', hp: -8, hap: -6 },
      terrible: { t: ['피하다 벽에 부딪혔다. 온몸이 얼얼하다...', '바퀴가 꼬리를 스쳤다. 비명조차 나오지 않았다.'], mood: 'hurt', hp: -20 },
    },
  },
  {
    id: 'winter', emoji: '🥶', title: '겨울 추위', stat: 'hp', tone: 'bad',
    text: '숨을 쉴 때마다 하얀 김이 난다. 발이 시리다.',
    outcomes: {
      great: { t: ['아직 따뜻한 자동차 보닛을 찾았다. 겨울도 살 만하다.', '보일러 실외기 옆을 발견했다. 여긴 봄이다.'], mood: 'happy', hp: 4 },
      good: { t: '몸을 동그랗게 말고 버텼다.', mood: 'idle', hp: -4 },
      bad: { t: '밤새 떨었다. 이런 밤이 몇 번이나 남았을까.', mood: 'sad', hp: -12 },
      terrible: { t: ['눈밭에서 길을 잃었다. 몸이 말을 안 듣는다...', '물그릇이 얼어 있었다. 마실 것조차 없다.'], mood: 'hurt', hp: -18, hap: -8 },
    },
  },
  {
    id: 'hunger', emoji: '🍽', title: '먹이를 못 찾음', stat: 'abi', tone: 'bad',
    text: '오늘도 빈 그릇이다. 배에서 소리가 난다.',
    outcomes: {
      great: { t: ['포기하려던 순간 누군가 밥을 놓고 갔다. 세상엔 좋은 사람도 있다.', '아무도 모르는 창고 구석에서 사료 봉지를 찾아냈다.'], mood: 'happy', hp: 8 },
      good: { t: '풀이라도 뜯었다. 배는 안 차지만 견딜 만하다.', mood: 'idle', hp: -4 },
      bad: { t: '하루 종일 아무것도 못 먹었다.', mood: 'sad', hp: -10 },
      terrible: { t: ['이틀째다. 걷는 것도 힘들다...', '먹을 걸 찾아 낯선 골목까지 갔다가 빈손으로 돌아왔다.'], mood: 'hurt', hp: -16 },
    },
  },
  {
    id: 'fight', emoji: '🤕', title: '싸움', stat: 'fri', tone: 'bad',
    text: '덩치 큰 고양이가 내 밥그릇 앞을 막아섰다.',
    outcomes: {
      great: { t: ['한 발 물러서는 척하다 기선을 제압했다. 이 구역은 내 거다.', '눈싸움에서 이겼다. 상대가 먼저 고개를 돌렸다.'], mood: 'proud', exp: 15, abi: 5 },
      good: { t: '적당히 으르렁대다 서로 물러났다.', mood: 'scared', hp: -5 },
      bad: { t: '귀가 찢어졌다. 밥그릇도 뺏겼다.', mood: 'hurt', hp: -12, abi: -3 },
      terrible: { t: ['크게 다쳤다. 한동안 못 움직일 것 같다...', '여러 마리가 한꺼번에 달려들었다. 도망치는 것 말고는 방법이 없었다.'], mood: 'hurt', hp: -20 },
    },
  },
  {
    id: 'sick', emoji: '🦠', title: '병', stat: 'hp', tone: 'bad',
    text: '눈이 자꾸 감긴다. 코가 막히고 몸이 뜨겁다.',
    outcomes: {
      great: { t: ['하루 푹 자고 일어나니 씻은 듯 나았다. 역시 잠이 보약이다.', '누가 약을 탄 사료를 놓고 갔다. 며칠 만에 눈이 떠졌다.'], mood: 'happy', hp: -2 },
      good: { t: '며칠 앓다가 나아졌다.', mood: 'sad', hp: -8 },
      bad: { t: '기침이 멎지 않는다. 몸이 무겁다.', mood: 'hurt', hp: -15, hap: -6 },
      terrible: { t: ['일어설 수가 없다. 이대로 끝인 걸까...', '눈이 붙어 떠지지 않는다. 세상이 온통 흐릿하다.'], mood: 'hurt', hp: -22 },
    },
  },
  {
    id: 'broom', emoji: '🧹', title: '사람에게 쫓겨남', stat: 'hap', tone: 'bad',
    text: '겨우 자리를 잡았는데 누가 빗자루를 들고 나온다.',
    outcomes: {
      great: { t: ['가게 주인이 마음을 바꿔 밥까지 줬다. 나는 귀여우니까.', '빗자루를 든 손이 멈췄다. "너였구나" 하는 얼굴이었다.'], mood: 'proud', exp: 8 },
      good: { t: '조용히 자리를 옮겼다. 익숙한 일이다.', mood: 'idle', hap: -4 },
      bad: { t: '고함소리에 놀라 도망쳤다. 왜 나를 싫어할까.', mood: 'sad', hap: -10, hp: -4 },
      terrible: { t: ['물벼락을 맞고 쫓겨났다. 서럽다.', '돌이 날아왔다. 사람이 이렇게 무서운 줄 몰랐다.'], mood: 'sad', hap: -15, hp: -8 },
    },
  },
  {
    id: 'bird', emoji: '🦅', title: '큰 새의 위협', stat: 'abi', tone: 'bad',
    text: '하늘에 커다란 그림자가 돈다. 나를 보고 있는 것 같다.',
    outcomes: {
      great: { t: ['그림자가 지나갈 때까지 완벽하게 숨었다. 나는 그림자의 일부다.', '오히려 등을 세우고 노려봤다. 새가 방향을 틀었다.'], mood: 'proud', exp: 20 },
      good: { t: '재빨리 차 밑으로 숨었다. 심장이 터질 것 같다.', mood: 'scared', hp: -4 },
      bad: { t: '발톱이 등을 스쳤다. 하늘이 무섭다.', mood: 'hurt', hp: -12 },
      terrible: { t: ['높이 들렸다가 떨어졌다. 온몸이 부서질 것 같다...', '등에 깊은 상처가 났다. 며칠은 하늘을 못 볼 것 같다.'], mood: 'hurt', hp: -22 },
    },
  },
  {
    id: 'farewell', emoji: '😿', title: '이별', stat: 'fri', tone: 'bad',
    text: '늘 같이 다니던 친구가 며칠째 보이지 않는다.',
    outcomes: {
      great: { t: ['골목 끝에서 다시 만났다. 우리는 또 같이 걷는다.', '좋은 집으로 갔다는 걸 알게 됐다. 잘된 일이다.'], mood: 'happy', hap: 5 },
      good: { t: '어디선가 잘 지내고 있겠지. 그렇게 믿기로 했다.', mood: 'sad', hap: -5 },
      bad: { t: '기다리던 자리에 아무도 오지 않았다.', mood: 'sad', fri: -1, hap: -10 },
      terrible: { t: ['다시는 볼 수 없다는 걸 알아버렸다.', '녀석이 늘 앉던 자리에 아무것도 남아 있지 않았다.'], mood: 'sad', fri: -2, hap: -16 },
    },
  },
  {
    id: 'construction', emoji: '🚧', title: '공사', stat: 'hap', tone: 'bad',
    text: '늘 자던 골목에 울타리가 쳐졌다. 굉음이 하루 종일 이어진다.',
    outcomes: {
      great: { t: ['공사장 인부가 밥을 챙겨주기 시작했다. 인생은 알 수 없다.', '더 조용하고 좋은 자리를 찾아냈다. 이사는 성공이다.'], mood: 'proud', exp: 12, hap: 5 },
      good: { t: '옆 골목으로 자리를 옮겼다. 적응하면 된다.', mood: 'idle', hap: -4 },
      bad: { t: '소음에 밤새 잠을 못 잤다.', mood: 'sad', hap: -10, hp: -5 },
      terrible: { t: ['내 자리가 통째로 사라졌다. 어디로 가야 할까.', '숨어 있던 곳이 무너졌다. 간신히 빠져나왔다.'], mood: 'hurt', hap: -14, hp: -10 },
    },
  },
  {
    id: 'kids', emoji: '🧒', title: '아이들', stat: 'abi', tone: 'bad',
    text: '아이 몇이 나를 둘러쌌다. 손에 뭔가 들고 있다.',
    outcomes: {
      great: { t: ['간식을 나눠줬다. 알고 보니 좋은 아이들이었다.', '한 아이가 다른 아이들을 말렸다. 그 애만은 기억해 두기로 했다.'], mood: 'happy', hap: 8, exp: 6 },
      good: { t: '적당히 거리를 두고 빠져나왔다.', mood: 'scared', hap: -3 },
      bad: { t: '꼬리를 잡혔다. 겨우 뿌리치고 도망쳤다.', mood: 'scared', hp: -7, hap: -6 },
      terrible: { t: ['돌을 던졌다. 다리를 절며 도망쳤다.', '구석에 몰려 한참을 괴롭힘당했다.'], mood: 'hurt', hp: -14, hap: -10 },
    },
  },
  {
    id: 'flea', emoji: '🐜', title: '벼룩', stat: 'hp', tone: 'bad',
    text: '온몸이 간지럽다. 긁어도 긁어도 소용이 없다.',
    outcomes: {
      great: { t: ['모래밭에서 실컷 뒹굴었더니 씻은 듯 사라졌다.', '누가 목덜미에 약을 발라줬다. 다음 날 거짓말처럼 편해졌다.'], mood: 'happy', hp: 3 },
      good: { t: '그루밍으로 어떻게든 버텼다.', mood: 'idle', hp: -3 },
      bad: { t: '긁다가 목덜미가 벗겨졌다.', mood: 'hurt', hp: -9, hap: -5 },
      terrible: { t: ['잠도 못 잘 만큼 간지럽다. 털이 뭉텅이로 빠졌다.', '상처가 덧났다. 몸에서 열이 난다.'], mood: 'hurt', hp: -15, hap: -8 },
    },
  },
  {
    id: 'trap', emoji: '🪤', title: '낯선 통덫', stat: 'abi', tone: 'bad',
    text: '먹이가 놓인 철망 상자다. 냄새는 좋은데 뭔가 이상하다.',
    outcomes: {
      great: { t: ['먹이만 쏙 빼먹고 빠져나왔다. 이런 건 나한테 안 통한다.', '한참 지켜보다 그냥 돌아섰다. 직감이 맞았다.'], mood: 'proud', exp: 16, abi: 5 },
      good: { t: '조심스럽게 냄새만 맡고 물러났다.', mood: 'scared', hap: -2 },
      bad: { t: '문이 닫혔다. 한참을 갇혀 있다가 겨우 풀려났다.', mood: 'scared', hp: -8, hap: -8 },
      terrible: { t: ['철망에 갇힌 채 어디론가 실려 갔다. 돌아오는 데 오래 걸렸다.', '발버둥치다 발톱이 부러졌다.'], mood: 'hurt', hp: -14, hap: -10 },
    },
  },
  {
    id: 'typhoon', emoji: '🌀', title: '태풍', stat: 'hp', tone: 'bad',
    text: '바람이 간판을 흔든다. 오늘 밤은 심상치 않다.',
    outcomes: {
      great: { t: ['지하 주차장으로 피했다. 밖의 소리가 남 일처럼 들린다.', '가장 튼튼한 구석을 골랐다. 밤새 아무 일도 없었다.'], mood: 'proud', exp: 12 },
      good: { t: '처마 밑에서 웅크리고 버텼다.', mood: 'scared', hp: -5 },
      bad: { t: '바람에 날아온 것들에 여기저기 부딪혔다.', mood: 'hurt', hp: -12, hap: -6 },
      terrible: { t: ['잠자리가 통째로 날아갔다. 밤새 비바람 속을 헤맸다.', '물이 차오르는 곳에 갇혔다. 겨우 높은 데로 올라갔다.'], mood: 'hurt', hp: -20, hap: -10 },
    },
  },
  {
    id: 'ice', emoji: '🧊', title: '얼음판', stat: 'abi', tone: 'bad',
    text: '밤새 언 길이 거울처럼 반짝인다. 발을 디디기가 무섭다.',
    outcomes: {
      great: { t: ['얼음 위를 미끄러지듯 건넜다. 이것도 재주라면 재주다.', '가장자리 눈길만 골라 밟았다. 완벽한 경로였다.'], mood: 'proud', exp: 14, abi: 4 },
      good: { t: '조심조심 건넜다. 다리가 후들거린다.', mood: 'scared', hp: -3 },
      bad: { t: '미끄러져 옆구리를 세게 부딪혔다.', mood: 'hurt', hp: -10 },
      terrible: { t: ['크게 미끄러져 다리를 절게 됐다.', '얼음이 깨지며 물에 빠졌다. 온몸이 얼어붙는 것 같다.'], mood: 'hurt', hp: -17, hap: -6 },
    },
  },
  {
    id: 'rival', emoji: '😾', title: '영역 침범', stat: 'fri', tone: 'bad',
    text: '내 자리에 낯선 냄새가 잔뜩 묻어 있다. 누가 다녀갔다.',
    outcomes: {
      great: { t: ['냄새를 덮어쓰고 자리를 지켰다. 여긴 여전히 내 구역이다.', '마주친 순간 상대가 먼저 물러섰다. 소문이 났나 보다.'], mood: 'proud', exp: 14, abi: 4 },
      good: { t: '적당히 자리를 나눠 쓰기로 했다.', mood: 'idle', hap: -3 },
      bad: { t: '결국 밀려났다. 새 자리를 찾아야 한다.', mood: 'sad', hap: -9, hp: -4 },
      terrible: { t: ['여러 마리가 몰려와 나를 쫓아냈다.', '오래 지켜온 자리를 하루아침에 잃었다.'], mood: 'sad', hap: -14, hp: -8 },
    },
  },
  {
    id: 'lost', emoji: '🧭', title: '길을 잃다', stat: 'exp', tone: 'bad',
    text: '낯선 골목이다. 아는 냄새가 하나도 없다.',
    outcomes: {
      great: { t: ['새로운 영역을 통째로 알아냈다. 길을 잃은 게 아니라 넓힌 것이다.', '별을 보고 방향을 잡았다. 아침에는 집 앞이었다.'], mood: 'proud', exp: 20, abi: 4 },
      good: { t: '한참 헤매다 아는 길을 찾았다.', mood: 'scared', exp: 8, hp: -3 },
      bad: { t: '밤새 헤맸다. 발바닥이 다 까졌다.', mood: 'hurt', hp: -10, hap: -5 },
      terrible: { t: ['며칠을 떠돌았다. 돌아왔을 때 내 자리는 없었다.', '점점 더 낯선 곳으로 갔다. 무섭다는 말로는 부족하다.'], mood: 'hurt', hp: -16, hap: -12 },
    },
  },
  {
    id: 'motorbike', emoji: '🛵', title: '오토바이', stat: 'abi', tone: 'bad',
    text: '좁은 골목으로 오토바이가 굉음을 내며 들어온다.',
    outcomes: {
      great: { t: ['담 위로 단숨에 뛰어올랐다. 아래를 내려다보며 코웃음쳤다.', '소리만 듣고도 방향을 읽었다. 여유롭게 피했다.'], mood: 'proud', exp: 12, abi: 3 },
      good: { t: '벽에 바짝 붙어 지나가길 기다렸다.', mood: 'scared', hap: -2 },
      bad: { t: '놀라서 반대편으로 튀어나가다 넘어졌다.', mood: 'hurt', hp: -8 },
      terrible: { t: ['바퀴가 코앞을 스쳤다. 한참을 일어나지 못했다.', '뒷다리를 스쳤다. 절뚝이며 겨우 숨었다.'], mood: 'hurt', hp: -17 },
    },
  },
  {
    id: 'puddle', emoji: '💧', title: '웅덩이', stat: 'abi', tone: 'bad',
    text: '길 한가운데 흙탕물이 고여 있다. 돌아가기엔 너무 멀다.',
    outcomes: {
      great: { t: ['징검다리처럼 돌만 밟고 건넜다. 발끝 하나 안 젖었다.', '단번에 뛰어넘었다. 내 도약력은 아직 죽지 않았다.'], mood: 'proud', exp: 10, abi: 3 },
      good: { t: '발만 조금 젖었다. 이 정도야.', mood: 'idle', hap: -2 },
      bad: { t: '흙탕물을 뒤집어썼다. 그루밍할 게 산더미다.', mood: 'sad', hap: -7, hp: -3 },
      terrible: { t: ['생각보다 깊었다. 온몸이 젖은 채로 밤을 맞았다.', '기름 섞인 물이었다. 털이 엉겨붙어 떨어지지 않는다.'], mood: 'hurt', hp: -12, hap: -8 },
    },
  },
  {
    id: 'thunder', emoji: '⛈', title: '천둥', stat: 'hap', tone: 'bad',
    text: '하늘이 번쩍이더니 배 속까지 울리는 소리가 났다.',
    outcomes: {
      great: { t: ['익숙한 소리다. 아무렇지 않게 잠을 청했다.', '가장 깊고 조용한 자리를 미리 찾아뒀다. 나는 준비된 고양이다.'], mood: 'proud', exp: 10, hap: 4 },
      good: { t: '귀를 접고 웅크렸다. 곧 지나갔다.', mood: 'scared', hap: -3 },
      bad: { t: '너무 놀라 아무 데나 뛰어들었다.', mood: 'scared', hp: -6, hap: -7 },
      terrible: { t: ['공포에 질려 밤새 달렸다. 어디까지 왔는지 모르겠다.', '몸이 굳어 움직이지 못했다. 그 밤은 아주 길었다.'], mood: 'hurt', hp: -12, hap: -12 },
    },
  },
];

// 판정 없는 연출 카드. 여러 번 나와도 이상하지 않은 일상들.
export const CALM_CARDS = [
  { id: 'night', emoji: '🌙', title: '밤 산책', text: '아무도 없는 새벽 골목. 이 시간은 온전히 내 것이다.', calm: { hap: 3, exp: 2 } },
  { id: 'box', emoji: '📦', title: '상자', text: '빈 상자를 발견했다. 들어가야 한다. 이유는 없다.', calm: { hap: 5 } },
  { id: 'yarn', emoji: '🧵', title: '실뭉치', text: '굴러다니는 실뭉치. 앞발이 저절로 나간다.', calm: { hap: 4, abi: 2 } },
  { id: 'paw', emoji: '🐾', title: '발자국', text: '눈 위에 내 발자국이 길게 남았다. 꽤 멀리 왔구나.', calm: { exp: 5 } },
  { id: 'peek', emoji: '🚪', title: '창밖 구경', text: '유리 너머로 사람들이 바쁘게 지나간다. 다들 어디로 가는 걸까.', calm: { hap: 2, exp: 3 } },
  { id: 'groom', emoji: '👅', title: '그루밍', text: '햇볕 아래 앉아 털을 고른다. 하루 중 가장 중요한 일과다.', calm: { hap: 4, hp: 2 } },
  { id: 'yawn', emoji: '🥱', title: '하품', text: '이유 없이 하품이 나온다. 그러고 보니 오늘도 별일 없었다.', calm: { hap: 3 } },
  { id: 'tailchase', emoji: '🌀', title: '꼬리 잡기', text: '내 꼬리가 자꾸 시야에 걸린다. 저건 잡아야 하는 것이다.', calm: { hap: 4, abi: 1 } },
  { id: 'laundry', emoji: '👕', title: '빨래 냄새', text: '널어놓은 빨래에서 좋은 냄새가 난다. 잠깐만 비비고 가야지.', calm: { hap: 5 } },
  { id: 'pigeon', emoji: '🕊', title: '비둘기 구경', text: '비둘기들이 뒤뚱거린다. 잡을 생각은 없다. 오늘은.', calm: { hap: 2, exp: 3 } },
  { id: 'stretch', emoji: '🙆', title: '기지개', text: '앞발을 쭉 뻗고 등을 늘인다. 뼈마디가 시원하다.', calm: { hp: 3, hap: 2 } },
  { id: 'moon', emoji: '🌕', title: '보름달', text: '달이 유난히 크다. 오늘 밤은 왠지 잠이 오지 않는다.', calm: { hap: 3, exp: 3 } },
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
    great: { t: ['눈을 피하지 않았다. 검은 고양이가 고개를 끄덕이고 사라졌다.', '먼저 다가가 코를 맞댔다. 검은 고양이가 길을 비켜줬다.'], mood: 'proud', score: 600, exp: 30 },
    good: { t: '조심스럽게 옆으로 지나갔다. 아무 일도 없었다.', mood: 'idle', exp: 5 },
    bad: { t: '겁을 먹고 도망쳤다. 뒤통수가 따갑다.', mood: 'scared', hap: -6 },
    terrible: { t: ['검은 고양이의 눈을 본 순간, 온몸에서 힘이 빠졌다...', '그 눈을 본 뒤로 며칠간 아무것도 먹지 못했다.'], mood: 'hurt', hpHalf: true },
  },
};
