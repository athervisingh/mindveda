// Mind Veda — Mind Check test content (Under 20 / Above 20), English + Hindi.
// Pure data. UI lives in pages/test.js.

export const TEST_SECONDS = 60

// Har question: score wahi option ke saath jaata hai. `scored: false` wale
// question sirf fun ke liye hain — total me count nahi hote.
const UNDER_20 = {
  id: 'under-20',
  maxScore: 18,
  label:    { en: 'Under 20', hi: '20 साल से कम' },
  title:    { en: 'Brain & Feeling Challenge', hi: 'ब्रेन और फीलिंग चैलेंज' },
  blurb:    { en: 'A quick, fun check of focus, memory and feelings.', hi: 'फोकस, याददाश्त और भावनाओं की एक मज़ेदार जाँच।' },
  emoji: '🧠',
  questions: [
    {
      id: 'q1', scored: true, emoji: '🎯',
      text: { en: "When you're doing homework, how easily do you get distracted?", hi: 'होमवर्क करते समय आपका ध्यान कितनी आसानी से भटक जाता है?' },
      options: [
        { emoji: '🐢', score: 0, label: { en: 'Not much',      hi: 'ज़्यादा नहीं' } },
        { emoji: '🐰', score: 1, label: { en: 'Sometimes',     hi: 'कभी-कभी' } },
        { emoji: '🐒', score: 2, label: { en: 'Very easily',   hi: 'बहुत आसानी से' } },
      ],
    },
    {
      id: 'q2', scored: true, emoji: '🧠',
      text: { en: 'You see 8 things for 10 seconds. How many do you remember?', hi: 'आपको 10 सेकंड के लिए 8 चीज़ें दिखाई जाती हैं। आपको कितनी याद रहती हैं?' },
      options: [
        { emoji: '🌱', score: 2, label: { en: '1–3', hi: '1–3' } },
        { emoji: '⭐', score: 1, label: { en: '4–6', hi: '4–6' } },
        { emoji: '🏆', score: 0, label: { en: '7–8', hi: '7–8' } },
      ],
    },
    {
      id: 'q3', scored: true, emoji: '🎮',
      text: { en: "Someone says, “Stop playing, it's time to study!” What do you do?", hi: 'कोई कहता है, "खेलना बंद करो, पढ़ाई का समय हो गया!" आप क्या करते हैं?' },
      options: [
        { emoji: '😌', score: 0, label: { en: 'Stop',           hi: 'तुरंत बंद कर देता/देती हूँ' } },
        { emoji: '🙂', score: 1, label: { en: 'After a minute', hi: 'एक मिनट बाद' } },
        { emoji: '😤', score: 2, label: { en: 'Argue',          hi: 'बहस करता/करती हूँ' } },
      ],
    },
    {
      id: 'q4', scored: true, emoji: '😡',
      text: { en: "When you're angry, what usually happens?", hi: 'जब आपको गुस्सा आता है, तो आमतौर पर क्या होता है?' },
      options: [
        { emoji: '🧘', score: 0, label: { en: 'Calm down',       hi: 'शांत हो जाता/जाती हूँ' } },
        { emoji: '🤔', score: 1, label: { en: 'Need some time',  hi: 'थोड़ा समय लगता है' } },
        { emoji: '🌋', score: 2, label: { en: 'React quickly',   hi: 'तुरंत रिएक्ट कर देता/देती हूँ' } },
      ],
    },
    {
      id: 'q5', scored: true, emoji: '💛',
      text: { en: 'Your friend is sad. You…?', hi: 'आपका दोस्त उदास है। आप…?' },
      options: [
        { emoji: '🫶', score: 0, label: { en: "Ask what's wrong",     hi: 'पूछते हैं कि क्या हुआ' } },
        { emoji: '😊', score: 1, label: { en: 'Try to cheer them up', hi: 'उसका मन बहलाने की कोशिश करते हैं' } },
        { emoji: '🤷', score: 2, label: { en: "Don't know what to do", hi: 'समझ नहीं आता क्या करूँ' } },
      ],
    },
    {
      id: 'q6', scored: true, emoji: '⏰',
      text: { en: 'When you have an important task…', hi: 'जब आपके पास कोई ज़रूरी काम होता है…' },
      options: [
        { emoji: '⚡', score: 0, label: { en: 'Do it quickly',   hi: 'तुरंत कर लेता/लेती हूँ' } },
        { emoji: '🐢', score: 1, label: { en: 'Take some time',  hi: 'थोड़ा समय लेता/लेती हूँ' } },
        { emoji: '💤', score: 2, label: { en: 'Keep delaying',   hi: 'टालता/टालती रहता/रहती हूँ' } },
      ],
    },
    {
      id: 'q7', scored: true, emoji: '🧩',
      text: { en: 'You get a difficult puzzle. You…?', hi: 'आपको एक मुश्किल पहेली मिलती है। आप…?' },
      options: [
        { emoji: '🏆', score: 0, label: { en: 'Keep trying',       hi: 'कोशिश करते रहते हैं' } },
        { emoji: '🙋', score: 1, label: { en: 'Ask for help',      hi: 'मदद माँगते हैं' } },
        { emoji: '😭', score: 2, label: { en: 'Give up quickly',   hi: 'जल्दी हार मान लेते हैं' } },
      ],
    },
    {
      id: 'q8', scored: true, emoji: '🎨',
      text: { en: 'Someone gives you a blank page and says, “Draw anything!”', hi: 'कोई आपको खाली पन्ना देकर कहता है, "जो मन करे बनाओ!"' },
      options: [
        { emoji: '🌈', score: 0, label: { en: 'Lots of ideas',           hi: 'ढेर सारे आइडिया आते हैं' } },
        { emoji: '😊', score: 1, label: { en: 'A few ideas',             hi: 'कुछ आइडिया आते हैं' } },
        { emoji: '🤔', score: 2, label: { en: "Don't know what to draw", hi: 'समझ नहीं आता क्या बनाऊँ' } },
      ],
    },
    {
      id: 'q9', scored: false, emoji: '🌧️',
      text: { en: 'You have a bad day. What helps you feel better?', hi: 'आपका दिन खराब गया। आपको बेहतर महसूस कराने में क्या मदद करता है?' },
      note: { en: 'Just for fun — this one is not scored.', hi: 'सिर्फ़ मज़े के लिए — इसका स्कोर नहीं जुड़ता।' },
      options: [
        { emoji: '🗣️', score: 0, label: { en: 'Talk to someone',     hi: 'किसी से बात करना' } },
        { emoji: '🎮', score: 0, label: { en: 'Do something fun',    hi: 'कुछ मज़ेदार करना' } },
        { emoji: '🧘', score: 0, label: { en: 'Take some quiet time', hi: 'थोड़ी देर शांत रहना' } },
      ],
    },
    {
      id: 'q10', scored: true, emoji: '🧩',
      text: { en: "You're solving a puzzle and your friend starts talking to you. What do you do?", hi: 'आप पहेली सुलझा रहे हैं और आपका दोस्त बात करने लगता है। आप क्या करते हैं?' },
      options: [
        { emoji: '🎯', score: 0, label: { en: 'Keep solving and listen later',      hi: 'सुलझाता रहता हूँ, बाद में सुनता हूँ' } },
        { emoji: '👂', score: 1, label: { en: 'Listen for a moment, then continue', hi: 'एक पल सुनता हूँ, फिर जारी रखता हूँ' } },
        { emoji: '🗣️', score: 2, label: { en: 'Forget the puzzle and start chatting', hi: 'पहेली भूलकर बातें करने लगता हूँ' } },
      ],
    },
  ],
  bands: [
    {
      min: 0, max: 4, emoji: '🌟',
      title: { en: 'Focus & Feelings Star', hi: 'फोकस और फीलिंग्स स्टार' },
      body:  { en: 'Your focus and your feelings both listen to you really well. Keep doing what you are doing!', hi: 'आपका ध्यान और आपकी भावनाएँ, दोनों आपकी बात बहुत अच्छे से सुनते हैं। ऐसे ही बने रहिए!' },
    },
    {
      min: 5, max: 9, emoji: '🌱',
      title: { en: 'Growing Mind', hi: 'बढ़ता हुआ माइंड' },
      body:  { en: 'Your mind is growing beautifully. A few minutes of quiet practice every day will make focus even easier.', hi: 'आपका माइंड बहुत अच्छे से बढ़ रहा है। रोज़ कुछ मिनट की शांत प्रैक्टिस से फोकस और आसान हो जाएगा।' },
    },
    {
      min: 10, max: 14, emoji: '🧭',
      title: { en: 'Mind Explorer', hi: 'माइंड एक्सप्लोरर' },
      body:  { en: 'Your mind loves to wander and explore — that is a gift. Small daily routines will help it settle when you need it to.', hi: 'आपका माइंड घूमना और नई चीज़ें खोजना पसंद करता है — यह एक खूबी है। छोटी-छोटी रोज़ की आदतें इसे ज़रूरत पड़ने पर शांत होना सिखा देंगी।' },
    },
    {
      min: 15, max: 18, emoji: '🫧',
      title: { en: 'Mind Needs a Little Pause', hi: 'माइंड को थोड़े आराम की ज़रूरत है' },
      body:  { en: 'Your mind is working very hard right now. A little rest, and one grown-up you trust to talk to, will help a lot.', hi: 'आपका माइंड अभी बहुत मेहनत कर रहा है। थोड़ा आराम और किसी भरोसेमंद बड़े से बात करना बहुत मदद करेगा।' },
    },
  ],
}

// Above 20 — har question 2/1/0. Q10 reverse scored hai.
const A20_OPTS = [
  { score: 2, label: { en: 'Often',     hi: 'अक्सर' } },
  { score: 1, label: { en: 'Sometimes', hi: 'कभी-कभी' } },
  { score: 0, label: { en: 'Rarely',    hi: 'शायद ही कभी' } },
]

const A20_Q = [
  ['🎯', 'Do you find it difficult to concentrate when there are distractions?', 'क्या ध्यान भटकाने वाली चीज़ों के बीच आपको एकाग्र होने में मुश्किल होती है?'],
  ['🔄', 'Do you often overthink situations after they happen?', 'क्या आप किसी घटना के बाद अक्सर उसके बारे में ज़रूरत से ज़्यादा सोचते रहते हैं?'],
  ['⏳', 'Do you postpone tasks even when you know they are important?', 'क्या आप ज़रूरी काम को जानते हुए भी टाल देते हैं?'],
  ['📱', 'Do you find yourself checking your phone without a specific reason?', 'क्या आप बिना किसी खास वजह के बार-बार फ़ोन चेक करते रहते हैं?'],
  ['💥', 'Do you sometimes react emotionally and regret it later?', 'क्या आप कभी-कभी भावनाओं में आकर रिएक्ट कर देते हैं और बाद में पछताते हैं?'],
  ['🙅', 'Do you have difficulty saying “no” to people?', 'क्या आपको लोगों को "ना" कहने में मुश्किल होती है?'],
  ['📊', 'Do you compare yourself with others on social media?', 'क्या आप सोशल मीडिया पर खुद की तुलना दूसरों से करते हैं?'],
  ['🌙', 'Do you find it difficult to switch off your thoughts before sleeping?', 'क्या आपको सोने से पहले अपने विचारों को बंद करने में मुश्किल होती है?'],
  ['🌡️', 'When stressed, do you notice changes in your mood or concentration?', 'तनाव में होने पर क्या आप अपने मूड या एकाग्रता में बदलाव महसूस करते हैं?'],
]

const ABOVE_20 = {
  id: 'above-20',
  maxScore: 20,
  label:    { en: '20 & above', hi: '20 साल या उससे ऊपर' },
  title:    { en: 'Mind & Focus Check', hi: 'माइंड और फोकस चेक' },
  blurb:    { en: 'A short self-check on focus, overthinking and emotional balance.', hi: 'फोकस, ओवरथिंकिंग और भावनात्मक संतुलन की एक छोटी सी जाँच।' },
  emoji: '🧠',
  questions: [
    ...A20_Q.map(([emoji, en, hi], i) => ({
      id: `q${i + 1}`, scored: true, emoji,
      text: { en, hi },
      options: A20_OPTS.map(o => ({ ...o })),
    })),
    {
      // Reverse scored — yahan "Usually" sabse acha jawab hai, isliye 0.
      id: 'q10', scored: true, emoji: '🧘', reverse: true,
      text: { en: 'Do you usually take time to understand your emotions before reacting?', hi: 'क्या आप रिएक्ट करने से पहले आमतौर पर अपनी भावनाओं को समझने के लिए समय लेते हैं?' },
      note: { en: 'Reverse scored — here, more often is better.', hi: 'यह उल्टा स्कोर होता है — यहाँ ज़्यादा बार करना बेहतर है।' },
      options: [
        { score: 0, label: { en: 'Usually',   hi: 'आमतौर पर' } },
        { score: 1, label: { en: 'Sometimes', hi: 'कभी-कभी' } },
        { score: 2, label: { en: 'Rarely',    hi: 'शायद ही कभी' } },
      ],
    },
  ],
  bands: [
    {
      min: 0, max: 5, emoji: '🌿',
      title: { en: 'Calm & Centred', hi: 'शांत और संतुलित' },
      body:  { en: 'Your attention and emotions are working with you, not against you. Keep protecting the habits that got you here.', hi: 'आपका ध्यान और आपकी भावनाएँ आपके साथ काम कर रही हैं, आपके ख़िलाफ़ नहीं। जिन आदतों ने यहाँ पहुँचाया, उन्हें बनाए रखिए।' },
    },
    {
      min: 6, max: 10, emoji: '⚖️',
      title: { en: 'Mostly Balanced', hi: 'ज़्यादातर संतुलित' },
      body:  { en: 'You handle most days well, but distraction and overthinking creep in. Small boundaries — with your phone and with people — will go a long way.', hi: 'ज़्यादातर दिन आप अच्छे से संभाल लेते हैं, पर ध्यान भटकना और ओवरथिंकिंग बीच-बीच में आ जाती है। फ़ोन और लोगों, दोनों के साथ छोटी-छोटी सीमाएँ बहुत काम आएँगी।' },
    },
    {
      min: 11, max: 15, emoji: '🌪️',
      title: { en: 'Mind Under Load', hi: 'मन पर दबाव' },
      body:  { en: 'Your mind is carrying more than it comfortably can right now. Structured rest, and talking it through with someone trained, will make a real difference.', hi: 'आपका मन इस समय अपनी सुविधा से ज़्यादा बोझ उठा रहा है। नियमित आराम और किसी प्रशिक्षित व्यक्ति से बात करना असली फ़र्क़ लाएगा।' },
    },
    {
      min: 16, max: 20, emoji: '🛎️',
      title: { en: 'Mind Needs a Reset', hi: 'मन को रीसेट की ज़रूरत है' },
      body:  { en: 'Focus, sleep and emotional balance are all asking for attention at once. Please do not carry this alone — a guided conversation is the fastest way forward.', hi: 'फोकस, नींद और भावनात्मक संतुलन — तीनों एक साथ ध्यान माँग रहे हैं। कृपया इसे अकेले मत उठाइए; एक निर्देशित बातचीत सबसे तेज़ रास्ता है।' },
    },
  ],
}

export const TESTS = { 'under-20': UNDER_20, 'above-20': ABOVE_20 }

export function bandFor(test, score) {
  return test.bands.find(b => score >= b.min && score <= b.max) || test.bands[test.bands.length - 1]
}

export const UI = {
  pageTitle:    { en: 'Mind Check', hi: 'माइंड चेक' },
  chooseTitle:  { en: 'Choose your age group', hi: 'अपना आयु वर्ग चुनिए' },
  chooseSub:    { en: 'You will only see the questions made for your age. The test takes 60 seconds.', hi: 'आपको सिर्फ़ अपनी उम्र के लिए बने सवाल दिखेंगे। टेस्ट 60 सेकंड का है।' },
  registered:   { en: 'Registration received ✓ Now take a quick 60-second Mind Check.', hi: 'रजिस्ट्रेशन मिल गया ✓ अब 60 सेकंड का छोटा सा माइंड चेक कीजिए।' },
  start:        { en: 'Start test', hi: 'टेस्ट शुरू करें' },
  questions:    { en: '10 questions · 60 seconds', hi: '10 सवाल · 60 सेकंड' },
  question:     { en: 'Question', hi: 'सवाल' },
  of:           { en: 'of', hi: '/' },
  back:         { en: 'Back', hi: 'पीछे' },
  skip:         { en: 'Skip', hi: 'छोड़ें' },
  finish:       { en: 'See my result', hi: 'मेरा रिज़ल्ट देखें' },
  timeLeft:     { en: 'Time left', hi: 'बचा समय' },
  timeUp:       { en: "Time's up!", hi: 'समय पूरा!' },
  yourScore:    { en: 'Your score', hi: 'आपका स्कोर' },
  attempted:    { en: 'answered', hi: 'सवालों के जवाब दिए' },
  unanswered:   { en: 'Unanswered questions were counted as 0.', hi: 'जिन सवालों के जवाब नहीं दिए, उन्हें 0 गिना गया है।' },
  funAnswer:    { en: 'Your fun answer', hi: 'आपका मज़ेदार जवाब' },
  notAnswered:  { en: 'Not answered', hi: 'जवाब नहीं दिया' },
  retake:       { en: 'Take again', hi: 'फिर से दें' },
  otherTest:    { en: 'Try the other age group', hi: 'दूसरा आयु वर्ग आज़माएँ' },
  home:         { en: 'Back to home', hi: 'होम पर जाएँ' },
  talk:         { en: 'Talk to Babita', hi: 'बबीता से बात करें' },
  disclaimer:   { en: 'This is a self-awareness check, not a medical diagnosis. If something feels heavy, please talk to a professional.', hi: 'यह आत्म-जागरूकता की जाँच है, कोई मेडिकल डायग्नोसिस नहीं। अगर कुछ भारी लग रहा है, तो कृपया किसी विशेषज्ञ से बात करें।' },
}
