import type { Topic, TopicIntensity } from "@/types/game";

type TopicSeed = [
  pack: string,
  intensity: TopicIntensity,
  prompt: string,
  sideA: string,
  sideB: string
];

const topicSeeds: TopicSeed[] = [
  ["Social Warfare", "spicy", "Should being left on read count as emotional vandalism?", "Yes. Silence can be used like a weapon.", "No. Nobody owes instant access to their brain."],
  ["Social Warfare", "spicy", "Should group chats be allowed to vote someone off the island?", "Yes. Every chat needs a survival mechanism.", "No. Digital exile is too much power for bored friends."],
  ["Social Warfare", "spicy", "Is ghosting just quitting without two weeks' notice?", "Yes. It is resignation by silence.", "No. Some conversations deserve a trapdoor."],
  ["Social Warfare", "spicy", "Should people who say 'we need to talk' have to include an agenda?", "Yes. Emotional ambushes need paperwork.", "No. Fear is part of the message."],
  ["Social Warfare", "spicy", "Is double texting confidence or desperation?", "Confidence. Momentum respects no queue.", "Desperation. Messages need personal space."],
  ["Social Warfare", "spicy", "Should vague posting be punishable by public questioning?", "Yes. If you post fog, accept interrogation.", "No. Mystery is the whole performance."],
  ["Social Warfare", "spicy", "Should friend groups have a designated bad-decision lawyer?", "Yes. Someone must object before the lore gets expensive.", "No. Bad decisions are how legends are made."],
  ["Social Warfare", "spicy", "Is saying 'no offense' an admission of guilt?", "Yes. It is a crime scene tape for the mouth.", "No. It is just social cushioning."],
  ["Social Warfare", "absurd", "Should awkward silences trigger courtroom lighting?", "Yes. The room deserves to know a trial has begun.", "No. A pause should not become a legal drama."],
  ["Social Warfare", "absurd", "Should every party have a live scoreboard for who is killing the vibe?", "Yes. Transparency protects the room.", "No. Vibe crimes need no public leaderboard."],
  ["Social Warfare", "absurd", "Should people who kill a joke have to bury it formally?", "Yes. The room needs closure.", "No. Dead jokes should disappear quietly."],

  ["Dating & Damage Control", "spicy", "Should dating apps show a chaos rating?", "Yes. Everyone deserves warning labels before flirting.", "No. Mystery is the entire business model."],
  ["Dating & Damage Control", "spicy", "Are red flags more fun than green flags?", "Yes. Stability rarely has plot twists.", "No. Fun should not require a warning label."],
  ["Dating & Damage Control", "spicy", "Should situationships have quarterly performance reviews?", "Yes. Ambiguity needs governance.", "No. Defining it ruins the whole ecosystem."],
  ["Dating & Damage Control", "spicy", "Is 'I'm not looking for anything serious' legally binding?", "Yes. It is a contract written in escape ink.", "No. Feelings ignore paperwork."],
  ["Dating & Damage Control", "spicy", "Should exes be banned from liking vacation photos?", "Yes. That is emotional trespassing.", "No. A like is not a peace treaty."],
  ["Dating & Damage Control", "spicy", "Should first dates allow a friend in an earpiece?", "Yes. Romance needs tactical support.", "No. Dating should not become a heist movie."],
  ["Dating & Damage Control", "spicy", "Is flirting in public everyone's business?", "Yes. The room becomes unpaid audience.", "No. People nearby chose to have eyes."],
  ["Dating & Damage Control", "spicy", "Should breakups require a public press release?", "Yes. The group chat needs official facts.", "No. Emotional disasters deserve privacy."],
  ["Dating & Damage Control", "absurd", "Should drunk texts go through a five-minute appeals court?", "Yes. The sender deserves emergency due process.", "No. Consequences build character."],
  ["Dating & Damage Control", "absurd", "Should thirst traps require a mission statement?", "Yes. The public deserves strategic clarity.", "No. Vibes should not file paperwork."],
  ["Dating & Damage Control", "absurd", "Should couples who baby-talk in public pay a noise tax?", "Yes. The community deserves compensation.", "No. Love is already embarrassing enough."],

  ["Money, Power & Bad Behavior", "spicy", "Should billionaires be forced to use normal customer service?", "Yes. Hold music is society's great equalizer.", "No. Nobody deserves that many menu options."],
  ["Money, Power & Bad Behavior", "spicy", "Should landlords have public ratings on every listing?", "Yes. Rent should come with receipts.", "No. Housing is already dramatic enough."],
  ["Money, Power & Bad Behavior", "spicy", "Should companies be banned from saying 'we're family'?", "Yes. Families do not schedule performance reviews.", "No. Every office needs one suspicious metaphor."],
  ["Money, Power & Bad Behavior", "spicy", "Should corporate apologies be read under oath?", "Yes. Sorry sounds different near consequences.", "No. PR teams would collapse immediately."],
  ["Money, Power & Bad Behavior", "spicy", "Is being rich proof of skill or proof of timing?", "Timing. Luck wears a very expensive suit.", "Skill. Money usually follows useful leverage."],
  ["Money, Power & Bad Behavior", "spicy", "Should tipping prompts be illegal above 25%?", "Yes. Tablets have become emotional extortion machines.", "No. Workers deserve every possible chance at money."],
  ["Money, Power & Bad Behavior", "spicy", "Should rent increases require a public apology video?", "Yes. Pain deserves eye contact.", "No. Housing markets do not do sincerity."],
  ["Money, Power & Bad Behavior", "absurd", "Should CEOs fight one spreadsheet in public before layoffs?", "Yes. Leadership should bleed Excel formulas first.", "No. Spreadsheets already punish everyone enough."],
  ["Money, Power & Bad Behavior", "absurd", "Should every subscription renewal come with a tiny villain laugh?", "Yes. At least be honest about the theft.", "No. Silence is part of the business model."],
  ["Money, Power & Bad Behavior", "absurd", "Should luxury brands be required to explain the price without using vibes?", "Yes. Fabric cannot cost a mortgage by confidence alone.", "No. Mystery is half the markup."],

  ["Politics Without Mercy", "spicy", "Should politicians answer yes or no before storytelling?", "Yes. Speeches should unlock after honesty.", "No. Dodging questions is their native sport."],
  ["Politics Without Mercy", "spicy", "Should voting day be a paid holiday?", "Yes. Democracy should not need a lunch break.", "No. Civic duty should survive inconvenience."],
  ["Politics Without Mercy", "spicy", "Should elected officials have public performance reviews?", "Yes. Power needs receipts.", "No. Elections are already the review."],
  ["Politics Without Mercy", "spicy", "Should campaign ads be forced to cite sources on screen?", "Yes. Lies hate footnotes.", "No. Politics runs on emotional fog."],
  ["Politics Without Mercy", "spicy", "Should political debates have mute buttons controlled by fact-checkers?", "Yes. Volume is not an argument.", "No. Chaos reveals character."],
  ["Politics Without Mercy", "spicy", "Is internet access a basic right or a paid convenience?", "Basic right. Life moved online.", "Paid convenience. Not every tool becomes sacred."],
  ["Politics Without Mercy", "spicy", "Should cities be fined for hostile benches?", "Yes. Public furniture should not hate the public.", "No. Benches cannot solve society."],
  ["Politics Without Mercy", "absurd", "Should politicians wear shock collars that buzz when they dodge questions?", "Yes. Accountability needs hardware.", "No. Democracy should not look like a game show."],
  ["Politics Without Mercy", "absurd", "Should every campaign promise become a legally binding side quest?", "Yes. Quests need completion tracking.", "No. Politics cannot survive a progress bar."],
  ["Politics Without Mercy", "absurd", "Should city councils settle minor disputes with dramatic courtroom music?", "Yes. Budget meetings need stakes.", "No. Government is already theater."],

  ["Workplace Hostilities", "spicy", "Should meetings without agendas be treated as theft?", "Yes. Time theft is still theft.", "No. Some chaos must happen live."],
  ["Workplace Hostilities", "spicy", "Is 'quick question' ever quick?", "Yes. Some people respect the adjective.", "No. It is the opening line of a saga."],
  ["Workplace Hostilities", "spicy", "Should cameras be off by default?", "Yes. Faces are not always required data.", "No. Meetings need visible accountability."],
  ["Workplace Hostilities", "spicy", "Is multitasking a myth?", "Yes. It is task-switching with confidence.", "No. Some minds run many tabs cleanly."],
  ["Workplace Hostilities", "spicy", "Should office snacks count as compensation?", "Yes. Granola bars are edible hush money.", "No. Snacks cannot replace pay."],
  ["Workplace Hostilities", "spicy", "Should unread work messages expire after business hours?", "Yes. Jobs should not haunt kitchens.", "No. Urgency does not respect clocks."],
  ["Workplace Hostilities", "spicy", "Should performance reviews include the manager's performance too?", "Yes. Judgment should be a two-way weapon.", "No. Hierarchy exists to avoid that discomfort."],
  ["Workplace Hostilities", "absurd", "Should spreadsheets play boss music when a formula breaks?", "Yes. Broken cells deserve a dramatic entrance.", "No. Data should not jumpscare the office."],
  ["Workplace Hostilities", "absurd", "Should bad project names be sent to a public naming trial?", "Yes. Morale dies one acronym at a time.", "No. Projects are hard enough without a courtroom."],
  ["Workplace Hostilities", "absurd", "Should slide decks explode confetti when they pass 40 slides?", "Yes. The room deserves a warning signal.", "No. Presentations should not become indoor weather."],

  ["Food Crimes With Consequences", "spicy", "Is ordering well-done steak a moral failure?", "Yes. Some choices reveal character.", "No. Personal taste is not a courtroom."],
  ["Food Crimes With Consequences", "spicy", "Should adults who hate vegetables be publicly investigated?", "Yes. Something went wrong and society needs answers.", "No. People may refuse leaves in peace."],
  ["Food Crimes With Consequences", "spicy", "Should brunch be abolished for being smug lunch?", "Yes. Eggs got a publicist and became unbearable.", "No. Brunch is joy with better lighting."],
  ["Food Crimes With Consequences", "spicy", "Should splitting the bill evenly be illegal if someone ordered three cocktails?", "Yes. That is financial ambush.", "No. Friendship means subsidizing chaos sometimes."],
  ["Food Crimes With Consequences", "spicy", "Is pineapple on pizza genius or a cry for help?", "Genius. Sweet and salty is strategy.", "Cry for help. Fruit should file a permit first."],
  ["Food Crimes With Consequences", "spicy", "Should restaurants ban burgers too tall to bite?", "Yes. Dinner should not require engineering.", "No. Height is part of the spectacle."],
  ["Food Crimes With Consequences", "absurd", "Should ketchup be legally reclassified as a cursed smoothie?", "Yes. It is blended tomato drama.", "No. Smoothies should not haunt hot dogs."],
  ["Food Crimes With Consequences", "absurd", "Should salads be required to include one aggressive crunch?", "Yes. Lettuce without sound is wet paperwork.", "No. Food should not need percussion."],
  ["Food Crimes With Consequences", "absurd", "Should soup be served in sports bottles for maximum speed?", "Yes. Dinner needs a fast lane.", "No. Soup should never touch a gym bag."],
  ["Food Crimes With Consequences", "absurd", "Should every charcuterie board have a security guard?", "Yes. Tiny meats create crowd control problems.", "No. Cheese should remain lawless."],

  ["Tech, Privacy & Digital Crimes", "spicy", "Should privacy still count when the app is free?", "Yes. Free should not mean spiritually naked.", "No. The price was personal chaos."],
  ["Tech, Privacy & Digital Crimes", "spicy", "Should typing indicators be banned?", "Yes. Three dots are psychological theater.", "No. Suspense improves messaging."],
  ["Tech, Privacy & Digital Crimes", "spicy", "Should people with 100 browser tabs lose internet privileges?", "Yes. That is digital hoarding.", "No. Those tabs are dreams in progress."],
  ["Tech, Privacy & Digital Crimes", "spicy", "Is inbox zero suspicious?", "Yes. No normal person defeats email.", "No. It is digital hygiene with receipts."],
  ["Tech, Privacy & Digital Crimes", "spicy", "Should social media likes be hidden from everyone?", "Yes. Public approval counts rot the brain.", "No. Numbers are the whole casino."],
  ["Tech, Privacy & Digital Crimes", "spicy", "Should phones have a built-in shame meter for screen time?", "Yes. The rectangle is too persuasive.", "No. Shame should not ship with updates."],
  ["Tech, Privacy & Digital Crimes", "absurd", "Are passwords tiny spells written by a panicked wizard?", "Yes. Symbols, numbers, and fear open the portal.", "No. Real spells do not demand a capital letter."],
  ["Tech, Privacy & Digital Crimes", "absurd", "Should loading bars be interrogated when they sit at 99%?", "Yes. That final percent knows what it did.", "No. Progress needs suspense."],
  ["Tech, Privacy & Digital Crimes", "absurd", "Should printers be put on probation after the third paper jam?", "Yes. Office equipment needs consequences.", "No. Printers are already living punishment."],
  ["Tech, Privacy & Digital Crimes", "absurd", "Should autocorrect testify for every relationship it has damaged?", "Yes. It owes the court context.", "No. Humans still pressed send."],

  ["Pop Culture Fights", "spicy", "Should spoilers expire after one week?", "Yes. Culture cannot wait forever.", "No. Discovery has no deadline."],
  ["Pop Culture Fights", "spicy", "Are remakes creative bankruptcy?", "Yes. Nostalgia is wearing a fake mustache.", "No. Good ideas deserve another trial."],
  ["Pop Culture Fights", "spicy", "Should opening credits be skippable by law?", "Yes. The remote deserves rights.", "No. Credits are the ritual gate."],
  ["Pop Culture Fights", "spicy", "Are subtitles superior even in your own language?", "Yes. Dialogue deserves backup.", "No. Eyes should be free to roam."],
  ["Pop Culture Fights", "spicy", "Should cliffhangers be taxed?", "Yes. Emotional debt has a cost.", "No. Suspense keeps civilization alert."],
  ["Pop Culture Fights", "spicy", "Are villains usually more reasonable than heroes?", "Yes. At least they have a plan.", "No. A plan can still be terrible."],
  ["Pop Culture Fights", "absurd", "Should every TV show be forced into a surprise courtroom finale?", "Yes. Even cooking shows need objections.", "No. Not every plot needs a tiny hammer."],
  ["Pop Culture Fights", "absurd", "Should action heroes be billed for every broken window?", "Yes. Saving the city needs receipts.", "No. Explosions cannot survive accounting."],
  ["Pop Culture Fights", "absurd", "Should fictional restaurants be reviewed like real ones?", "Yes. Imaginary soup can still disappoint.", "No. Fictional waiters are under enough pressure."],
  ["Pop Culture Fights", "absurd", "Should movie trailers reveal only one random shoe?", "Yes. Mystery deserves discipline.", "No. People need at least one explosion receipt."],

  ["Philosophical Chaos", "spicy", "Is being right overrated?", "Yes. Peace often beats accuracy.", "No. Reality should not lose the debate."],
  ["Philosophical Chaos", "spicy", "Is confidence just volume with posture?", "Yes. Presentation does most of the work.", "No. Confidence has internal paperwork."],
  ["Philosophical Chaos", "spicy", "Is planning just procrastination wearing a blazer?", "Yes. It delays action politely.", "No. Planning is action with a map."],
  ["Philosophical Chaos", "spicy", "Can silence be more disrespectful than yelling?", "Yes. Silence can be surgical.", "No. Volume is still the blunt weapon."],
  ["Philosophical Chaos", "spicy", "Should revenge be considered a productivity system?", "Yes. Spite gets things done.", "No. Motivation should not smell like gasoline."],
  ["Philosophical Chaos", "absurd", "Can a sandwich legally be accused of cowardice?", "Yes. Falling apart under pressure is evidence.", "No. Bread cannot be cross-examined."],
  ["Philosophical Chaos", "absurd", "Are stairs just gravity making you fill out paperwork?", "Yes. Each step is another form.", "No. Gravity is too lazy for administration."],
  ["Philosophical Chaos", "absurd", "Should mirrors be required to testify under oath?", "Yes. They have seen every outfit crime.", "No. Reflections are unreliable narrators."],
  ["Philosophical Chaos", "absurd", "Are elevators tiny hotels that refuse overnight guests?", "Yes. They have rooms, floors, and bad music.", "No. A hotel should not open sideways."],
  ["Philosophical Chaos", "absurd", "Should every couch have legal custody of the remote?", "Yes. It has hosted the remote longest.", "No. Furniture cannot be trusted with power."],

  ["Party Crimes", "spicy", "Should karaoke require consent from everyone in the room?", "Yes. Public singing affects bystanders.", "No. Karaoke is emotional civil disobedience."],
  ["Party Crimes", "spicy", "Is the aux cord a leadership position?", "Yes. Music controls the room.", "No. Leadership needs more than playlists."],
  ["Party Crimes", "spicy", "Should clapping when planes land be socially punished?", "Yes. Professionals should not need applause.", "No. Landing is a group achievement."],
  ["Party Crimes", "spicy", "Should birthdays last a full week?", "Yes. One day is poor celebration logistics.", "No. A week creates emotional inflation."],
  ["Party Crimes", "spicy", "Are matching outfits powerful or terrifying?", "Powerful. Coordination intimidates reality.", "Terrifying. Individuality deserves oxygen."],
  ["Party Crimes", "spicy", "Should dessert menus arrive before the main menu?", "Yes. Priorities should be transparent.", "No. Dinner needs narrative order."],
  ["Party Crimes", "absurd", "Should every party have a designated mayor by 11 PM?", "Yes. Someone must govern the chaos.", "No. Nightlife should remain unincorporated."],
  ["Party Crimes", "absurd", "Should the worst dancer receive diplomatic immunity?", "Yes. Confidence deserves legal protection.", "No. Rhythm crimes need consequences."],
  ["Party Crimes", "absurd", "Should snacks be locked until someone starts drama?", "Yes. Conflict needs incentives.", "No. Snacks should not be hostage negotiators."],
  ["Party Crimes", "absurd", "Should hangovers come with a written incident report?", "Yes. The body deserves documentation.", "No. Some mysteries protect the soul."]
];

export const TOPICS: Topic[] = topicSeeds.map(([pack, intensity, prompt, sideA, sideB]) => ({
  id: `${pack}-${prompt}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
  pack,
  intensity: intensity as TopicIntensity,
  prompt,
  sideA,
  sideB
}));

export const TOPIC_PACKS = Array.from(new Set(TOPICS.map((topic) => topic.pack ?? "Core")));

export function filterTopics(
  topics: readonly Topic[],
  packs: readonly string[],
  intensity: TopicIntensity
): Topic[] {
  const allowedIntensity: Record<TopicIntensity, TopicIntensity[]> = {
    spicy: ["spicy"],
    absurd: ["spicy", "absurd"]
  };
  const packSet = new Set(packs.length ? packs : TOPIC_PACKS);
  return topics.filter(
    (topic) =>
      packSet.has(topic.pack ?? "Core") &&
      allowedIntensity[intensity].includes(topic.intensity ?? "spicy")
  );
}
