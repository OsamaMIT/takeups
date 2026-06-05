import type { Topic, TopicIntensity } from "@/types/game";

type TopicSeed = [
  pack: string,
  intensity: TopicIntensity,
  prompt: string,
  sideA: string,
  sideB: string
];

const topicSeeds: TopicSeed[] = [
  ["Absurd Everyday Takes", "safe", "Are escalators just lazy stairs?", "Yes. Escalators are stairs that gave up.", "No. Escalators are public transportation for ankles."],
  ["Absurd Everyday Takes", "safe", "Should socks have a left and right label?", "Yes. Feet deserve assigned seating.", "No. Socks should remain a free society."],
  ["Absurd Everyday Takes", "absurd", "Should shopping carts require driver's licenses?", "Yes. Four wheels and aisle rage demand regulation.", "No. The produce section cannot become the DMV."],
  ["Absurd Everyday Takes", "safe", "Should elevator music be legally required?", "Yes. Silence in elevators is too powerful.", "No. We should not soundtrack vertical waiting."],
  ["Absurd Everyday Takes", "spicy", "Is making the bed pointless?", "Yes. It is a daily reset of a temporary exhibit.", "No. The bed must know who is in charge."],
  ["Absurd Everyday Takes", "safe", "Should umbrellas have headlights?", "Yes. Rain turns sidewalks into stealth missions.", "No. Umbrellas should not become small cars."],
  ["Absurd Everyday Takes", "absurd", "Are pigeons undercover city employees with terrible disguises?", "Yes. They patrol every plaza and fear no authority.", "No. City employees at least pretend to have emails."],
  ["Absurd Everyday Takes", "safe", "Should doors say push or pull out loud?", "Yes. Society needs fewer glass-door defeats.", "No. Doors should test character quietly."],
  ["Absurd Everyday Takes", "safe", "Is laundry a subscription service?", "Yes. It renews weekly without consent.", "No. Subscriptions at least send emails."],
  ["Absurd Everyday Takes", "spicy", "Should alarm clocks apologize?", "Yes. They commit emotional damage daily.", "No. They are the only honest device."],
  ["Absurd Everyday Takes", "absurd", "Should every couch have legal custody of the remote?", "Yes. It has hosted the remote more than anyone else.", "No. Furniture cannot be trusted with power."],
  ["Absurd Everyday Takes", "safe", "Is a hallway just a room with commitment issues?", "Yes. It exists but refuses furniture.", "No. Hallways are roads wearing carpet."],
  ["Absurd Everyday Takes", "spicy", "Should everyone own one dramatic cape?", "Yes. Errands need higher production value.", "No. Grocery aisles cannot handle that wind resistance."],

  ["Food Crimes", "safe", "Is cereal soup?", "Yes. Cereal is soup.", "No. Cereal is not soup."],
  ["Food Crimes", "spicy", "Should pizza be eaten with a fork?", "Yes. Civilization begins at the utensil.", "No. Pizza was built for direct contact."],
  ["Food Crimes", "safe", "Are fries a main course?", "Yes. Fries are potatoes with ambition.", "No. Fries are supporting actors with salt."],
  ["Food Crimes", "absurd", "Should ketchup be legally reclassified as a cursed smoothie?", "Yes. It is blended tomato drama in a squeeze bottle.", "No. Smoothies should not arrive at crime scenes."],
  ["Food Crimes", "spicy", "Is pineapple on pizza elite?", "Yes. Sweet and salty is strategic warfare.", "No. Fruit should file a permit first."],
  ["Food Crimes", "safe", "Should sandwiches be cut diagonally?", "Yes. Triangles taste more expensive.", "No. Rectangles respect structural integrity."],
  ["Food Crimes", "spicy", "Is room-temperature pizza superior?", "Yes. It becomes stable and honest.", "No. Cold cheese is a warning sign."],
  ["Food Crimes", "safe", "Are pancakes just breakfast cake?", "Yes. Syrup is frosting with better marketing.", "No. Cake does not need a skillet passport."],
  ["Food Crimes", "absurd", "Should soup be served in sports bottles for maximum speed?", "Yes. Dinner needs a fast lane.", "No. Soup should never make eye contact with a gym bag."],
  ["Food Crimes", "safe", "Is a hot dog a sandwich?", "Yes. Bread surrounds filling. Case closed.", "No. A hinge bun creates its own category."],
  ["Food Crimes", "spicy", "Should coffee count as breakfast?", "Yes. It is bean soup with purpose.", "No. Breakfast should not be a liquid panic button."],
  ["Food Crimes", "safe", "Are cupcakes muffins in formalwear?", "Yes. Frosting is just a tiny tuxedo.", "No. Muffins have never known glamour."],
  ["Food Crimes", "absurd", "Should salads be required to include at least one dramatic crunch?", "Yes. Lettuce without sound is just wet paperwork.", "No. Food should not need percussion."],

  ["Social Etiquette", "safe", "Should voice notes require appointments?", "Yes. Audio ambushes are poor governance.", "No. Voice notes are democracy with breathing."],
  ["Social Etiquette", "spicy", "Is replying 'haha' legally sufficient?", "Yes. It closes the emotional loop.", "No. The conversation deserves evidence of laughter."],
  ["Social Etiquette", "safe", "Should group chats have office hours?", "Yes. Notifications need boundaries.", "No. Chaos is the point of a group chat."],
  ["Social Etiquette", "spicy", "Is being five minutes late basically on time?", "Yes. Time has soft edges.", "No. Clocks were invented for a reason."],
  ["Social Etiquette", "safe", "Should small talk have a time limit?", "Yes. Weather analysis should expire.", "No. Small talk is society's loading screen."],
  ["Social Etiquette", "absurd", "Should awkward silences trigger instant courtroom lighting?", "Yes. The room deserves to know a trial has begun.", "No. A quiet pause should not become a legal drama."],
  ["Social Etiquette", "safe", "Should people announce when they leave a party?", "Yes. Disappearing is dramatic and inefficient.", "No. The quiet exit is an art form."],
  ["Social Etiquette", "spicy", "Is double texting a power move?", "Yes. Momentum respects no queue.", "No. Messages need personal space."],
  ["Social Etiquette", "safe", "Should handshakes be retired?", "Yes. The nod can carry the institution.", "No. Business needs one tiny contest."],
  ["Social Etiquette", "absurd", "Should every meeting begin with one person being fake-fired for tension?", "Yes. Fear creates efficient agendas.", "No. A calendar invite should not include theater."],
  ["Social Etiquette", "safe", "Is 'no worries' secretly powerful?", "Yes. It ends conflicts with velvet.", "No. It hides too much mystery."],
  ["Social Etiquette", "spicy", "Should unread messages expire?", "Yes. Ghosts need a statute of limitations.", "No. Some texts must age like evidence."],
  ["Social Etiquette", "safe", "Is leaving a cart in the aisle a public statement?", "Yes. It declares war on circulation.", "No. It is temporary logistics."],

  ["Pop Culture Logic", "safe", "Should movie trailers reveal nothing?", "Yes. A trailer should be a locked door.", "No. People need at least one explosion receipt."],
  ["Pop Culture Logic", "spicy", "Are spoilers useful?", "Yes. They protect time and lower stress.", "No. Spoilers are narrative theft."],
  ["Pop Culture Logic", "safe", "Should villains get customer-service training?", "Yes. Better communication could solve act two.", "No. Villains should not optimize their brand."],
  ["Pop Culture Logic", "absurd", "Should every TV show be forced to add a surprise courtroom finale?", "Yes. Even cooking shows need objections.", "No. Not every plot needs a tiny wooden hammer."],
  ["Pop Culture Logic", "safe", "Are side characters usually right?", "Yes. They see the plot from a safer distance.", "No. Main characters carry the burden of chaos."],
  ["Pop Culture Logic", "spicy", "Should opening credits be skippable by law?", "Yes. The remote deserves rights.", "No. Credits are the ritual gate."],
  ["Pop Culture Logic", "safe", "Is a reboot better than a sequel?", "Yes. Reset the mess and keep the theme.", "No. Consequences should survive branding."],
  ["Pop Culture Logic", "absurd", "Should action heroes be personally billed for every broken window?", "Yes. Saving the city should include itemized receipts.", "No. Explosions cannot survive accounting."],
  ["Pop Culture Logic", "safe", "Are subtitles always better?", "Yes. Dialogue deserves backup.", "No. Eyes should be free to roam."],
  ["Pop Culture Logic", "spicy", "Should cliffhangers be taxed?", "Yes. Emotional debt has a cost.", "No. Suspense keeps civilization alert."],
  ["Pop Culture Logic", "safe", "Is background music manipulative?", "Yes. Strings are emotional lobbying.", "No. Scenes need atmosphere to breathe."],
  ["Pop Culture Logic", "absurd", "Should fictional restaurants be reviewed like real ones?", "Yes. Imaginary soup can still disappoint.", "No. Fictional waiters are already under enough pressure."],
  ["Pop Culture Logic", "safe", "Are remixes better than originals?", "Yes. Revision is artistic democracy.", "No. The first version owns the lightning."],

  ["Tech & Internet", "safe", "Should phones have a boredom mode?", "Yes. The rectangle is too persuasive.", "No. Boredom should not need software."],
  ["Tech & Internet", "spicy", "Is inbox zero suspicious?", "Yes. No normal person defeats email.", "No. It is digital hygiene with receipts."],
  ["Tech & Internet", "safe", "Should autocorrect have to explain itself?", "Yes. It owes testimony for every betrayal.", "No. Autocorrect works under pressure."],
  ["Tech & Internet", "absurd", "Are passwords tiny digital spells written by a panicked wizard?", "Yes. Symbols, numbers, and fear open the portal.", "No. Real spells do not ask for a capital letter."],
  ["Tech & Internet", "spicy", "Should all apps have quiet mode by default?", "Yes. Notifications are tiny doorbells.", "No. Apps must announce their existence."],
  ["Tech & Internet", "safe", "Is the cloud just someone else's attic?", "Yes. We store things in a mystery ceiling.", "No. Attics do not have uptime dashboards."],
  ["Tech & Internet", "absurd", "Should loading bars be interrogated when they sit at 99%?", "Yes. That final percent knows what it did.", "No. Progress needs a little suspense."],
  ["Tech & Internet", "safe", "Are screenshots modern note-taking?", "Yes. Capture first, understand later.", "No. Notes require thoughts, not panic images."],
  ["Tech & Internet", "spicy", "Should typing indicators be banned?", "Yes. Three dots are psychological theater.", "No. Suspense improves messaging."],
  ["Tech & Internet", "safe", "Is dark mode a personality trait?", "Yes. It signals serious screen discipline.", "No. It is just less light."],
  ["Tech & Internet", "absurd", "Should printers be put on probation after the third paper jam?", "Yes. Office equipment needs consequences.", "No. Printers are already living punishment."],
  ["Tech & Internet", "safe", "Are browser tabs a to-do list?", "Yes. Every tab is a small promise.", "No. Tabs are abandoned digital furniture."],
  ["Tech & Internet", "spicy", "Should people narrate calendar invites?", "Yes. Context prevents meeting crimes.", "No. The title is enough evidence."],

  ["School / Work Chaos", "safe", "Should meetings have a maximum number of chairs?", "Yes. Chairs invite unnecessary opinions.", "No. Standing meetings are a threat."],
  ["School / Work Chaos", "spicy", "Is 'quick question' ever quick?", "Yes. Some people respect the adjective.", "No. It is the opening line of a saga."],
  ["School / Work Chaos", "safe", "Should homework have trailers?", "Yes. Students deserve a preview of pain.", "No. Suspense is part of education."],
  ["School / Work Chaos", "absurd", "Should spreadsheets play boss music when a formula breaks?", "Yes. Broken cells deserve a dramatic entrance.", "No. Data should not jumpscare the office."],
  ["School / Work Chaos", "spicy", "Is a standing desk a personality?", "Yes. It changes how people enter rooms.", "No. It is furniture with height settings."],
  ["School / Work Chaos", "safe", "Should all deadlines be at noon?", "Yes. Midnight is dramatic and rude.", "No. Night deadlines reveal commitment."],
  ["School / Work Chaos", "absurd", "Should bad project names be sent to a public naming trial?", "Yes. Morale dies one acronym at a time.", "No. Projects are hard enough without a courtroom."],
  ["School / Work Chaos", "safe", "Are office snacks a form of diplomacy?", "Yes. Granola bars prevent unrest.", "No. Snacks cannot replace decisions."],
  ["School / Work Chaos", "spicy", "Should cameras be off by default?", "Yes. Faces are not always required data.", "No. Meetings need visible accountability."],
  ["School / Work Chaos", "safe", "Is a backpack just a portable drawer?", "Yes. It carries chaos with straps.", "No. Drawers do not ruin posture."],
  ["School / Work Chaos", "absurd", "Should slide decks explode confetti when they pass 40 slides?", "Yes. The room deserves a warning signal.", "No. Presentations should not become indoor weather."],
  ["School / Work Chaos", "safe", "Should lunch breaks be renamed recovery periods?", "Yes. The body is rebooting.", "No. Lunch should not sound medical."],
  ["School / Work Chaos", "spicy", "Is multitasking a myth?", "Yes. It is task-switching with confidence.", "No. Some minds run many tabs cleanly."],

  ["Philosophical Nonsense", "safe", "If a chair is uncomfortable, is it still a chair?", "Yes. Failure does not erase identity.", "No. A chair must honor the sit."],
  ["Philosophical Nonsense", "absurd", "Can a sandwich legally be accused of cowardice?", "Yes. Falling apart under pressure is evidence.", "No. Bread cannot be cross-examined."],
  ["Philosophical Nonsense", "safe", "Is waiting a hobby?", "Yes. People practice it constantly.", "No. Hobbies require consent."],
  ["Philosophical Nonsense", "spicy", "Is being right overrated?", "Yes. Peace often beats accuracy.", "No. Reality should not lose the debate."],
  ["Philosophical Nonsense", "safe", "Does a to-do list create more work?", "Yes. Naming tasks gives them power.", "No. The work already existed quietly."],
  ["Philosophical Nonsense", "absurd", "Are stairs just gravity making you fill out paperwork?", "Yes. Each step is another required form.", "No. Gravity is too lazy for administration."],
  ["Philosophical Nonsense", "safe", "Can a room have a mood?", "Yes. Lighting is emotional architecture.", "No. Rooms are innocent containers."],
  ["Philosophical Nonsense", "spicy", "Is confidence just volume with posture?", "Yes. Presentation does most of the work.", "No. Confidence has internal paperwork."],
  ["Philosophical Nonsense", "safe", "Is a shortcut still a shortcut if everyone uses it?", "Yes. Efficiency scales.", "No. Popular shortcuts become roads."],
  ["Philosophical Nonsense", "absurd", "Should mirrors be required to testify under oath?", "Yes. They have seen every outfit crime.", "No. Reflections are unreliable narrators."],
  ["Philosophical Nonsense", "safe", "Can silence be an answer?", "Yes. It is punctuation with courage.", "No. Answers need content."],
  ["Philosophical Nonsense", "spicy", "Is planning just procrastination in formal clothes?", "Yes. It delays action politely.", "No. Planning is action with a map."],
  ["Philosophical Nonsense", "absurd", "Are elevators tiny hotels that refuse overnight guests?", "Yes. They have rooms, floors, and terrible music.", "No. A hotel should not threaten to open sideways."],

  ["After Dark / Hot Takes", "spicy", "Should dating apps show a chaos rating?", "Yes. Everyone deserves warning labels before flirting.", "No. Mystery is the entire business model."],
  ["After Dark / Hot Takes", "spicy", "Is ghosting just quitting without two weeks' notice?", "Yes. It is resignation by silence.", "No. Some conversations deserve a trapdoor."],
  ["After Dark / Hot Takes", "spicy", "Should thirst traps require a mission statement?", "Yes. The public deserves strategic clarity.", "No. Vibes should not file paperwork."],
  ["After Dark / Hot Takes", "spicy", "Is a 'u up?' text basically a bat signal?", "Yes. It summons chaos after midnight.", "No. It is just minimalist literature."],
  ["After Dark / Hot Takes", "spicy", "Should situationships have quarterly performance reviews?", "Yes. Ambiguity needs governance.", "No. Defining it ruins the whole ecosystem."],
  ["After Dark / Hot Takes", "spicy", "Should exes be banned from liking vacation photos?", "Yes. That is emotional trespassing.", "No. A like is not a peace treaty."],
  ["After Dark / Hot Takes", "spicy", "Are red flags more fun than green flags?", "Yes. Stability rarely has plot twists.", "No. Fun should not require a warning label."],
  ["After Dark / Hot Takes", "spicy", "Should drunk texts have a five-minute appeals court?", "Yes. The sender deserves emergency due process.", "No. Consequences build character."],
  ["After Dark / Hot Takes", "spicy", "Is flirting at a bar a public performance?", "Yes. Everyone nearby becomes unpaid audience.", "No. The room chose to have eyes."],
  ["After Dark / Hot Takes", "spicy", "Should one-night stands get exit interviews?", "Yes. Feedback improves the nightlife economy.", "No. Some reports should never be generated."],
  ["After Dark / Hot Takes", "spicy", "Should couples who baby-talk in public pay a fine?", "Yes. The community deserves compensation.", "No. Love is already embarrassing enough."],
  ["After Dark / Hot Takes", "spicy", "Is 'I'm not looking for anything serious' legally binding?", "Yes. It is a contract written in escape ink.", "No. Feelings ignore paperwork."],
  ["After Dark / Hot Takes", "spicy", "Should first dates allow a friend in an earpiece?", "Yes. Romance needs tactical support.", "No. Dating should not become a heist movie."],
  ["After Dark / Hot Takes", "spicy", "Should breakups require a public press conference?", "Yes. The group chat needs official facts.", "No. Emotional disasters deserve privacy."],
  ["After Dark / Hot Takes", "spicy", "Is being left on read psychological warfare?", "Yes. Silence can wear a uniform.", "No. People are allowed to own their thumbs."],
  ["After Dark / Hot Takes", "spicy", "Should every friend group have a designated bad-decision lawyer?", "Yes. Someone must object before karaoke.", "No. Bad decisions are how lore is made."],
  ["After Dark / Hot Takes", "spicy", "Should billionaires have to use normal customer service?", "Yes. Hold music is society's great equalizer.", "No. Nobody deserves that much menu navigation."],
  ["After Dark / Hot Takes", "spicy", "Should politicians answer yes or no before storytelling?", "Yes. Speeches should unlock after honesty.", "No. Dodging questions is their native sport."],
  ["After Dark / Hot Takes", "spicy", "Is internet access a basic right or a luxury subscription?", "It is a basic right because life moved online.", "It is a luxury because not every convenience becomes sacred."],
  ["After Dark / Hot Takes", "spicy", "Should privacy still count when the app is free?", "Yes. Free should not mean spiritually naked.", "No. The price was paid in personal chaos."],
  ["After Dark / Hot Takes", "spicy", "Should cities be fined for hostile benches?", "Yes. Public furniture should not hate the public.", "No. Benches are not responsible for society."],
  ["After Dark / Hot Takes", "spicy", "Should voting day be a paid holiday?", "Yes. Democracy should not need a lunch break.", "No. Civic duty should survive inconvenience."],
  ["After Dark / Hot Takes", "spicy", "Should landlords have Yelp reviews on every listing?", "Yes. Rent should come with receipts.", "No. Housing is already too dramatic."],
  ["After Dark / Hot Takes", "spicy", "Should corporate apologies be read under oath?", "Yes. Sorry sounds different near consequences.", "No. PR teams would collapse immediately."],
  ["After Dark / Hot Takes", "spicy", "Should companies be banned from saying 'we're family'?", "Yes. Families do not schedule performance reviews.", "No. Every office needs one suspicious metaphor."],

  ["Spicy But Safe", "spicy", "Should restaurants ban overly tall burgers?", "Yes. Dinner should not require engineering.", "No. Height is part of the spectacle."],
  ["Spicy But Safe", "spicy", "Is brunch just lunch with better branding?", "Yes. Eggs do all the marketing.", "No. Brunch has its own social contract."],
  ["Spicy But Safe", "spicy", "Should people clap when planes land?", "Yes. Landing is a group achievement.", "No. Professionals should not need applause."],
  ["Spicy But Safe", "spicy", "Is karaoke a public service?", "Yes. It releases emotional pressure.", "No. Some songs should stay private."],
  ["Spicy But Safe", "spicy", "Should spoilers expire after one month?", "Yes. Culture cannot wait forever.", "No. Discovery has no deadline."],
  ["Spicy But Safe", "spicy", "Is a messy desk more creative?", "Yes. Chaos keeps ideas visible.", "No. Creativity should know where the pen is."],
  ["Spicy But Safe", "spicy", "Should everyone have a signature entrance?", "Yes. Presence should be intentional.", "No. Doors are not stages."],
  ["Spicy But Safe", "spicy", "Are matching outfits powerful?", "Yes. Coordination intimidates reality.", "No. Individuality deserves oxygen."],
  ["Spicy But Safe", "spicy", "Should dessert menus arrive first?", "Yes. Priorities should be transparent.", "No. Dinner needs narrative order."],
  ["Spicy But Safe", "spicy", "Is the aux cord a leadership position?", "Yes. Music controls the room.", "No. Leadership needs more than playlists."],
  ["Spicy But Safe", "spicy", "Should birthdays last a full week?", "Yes. One day is poor celebration logistics.", "No. A week creates emotional inflation."],
  ["Spicy But Safe", "spicy", "Is silent mode a sign of maturity?", "Yes. Peace begins with fewer alerts.", "No. Availability is a civic duty."],
  ["Spicy But Safe", "spicy", "Should every apartment have a snack drawer?", "Yes. Hospitality needs infrastructure.", "No. Snacks should not colonize furniture."]
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
    safe: ["safe"],
    spicy: ["safe", "spicy"],
    absurd: ["safe", "spicy", "absurd"]
  };
  const packSet = new Set(packs.length ? packs : TOPIC_PACKS);
  return topics.filter(
    (topic) =>
      packSet.has(topic.pack ?? "Core") &&
      allowedIntensity[intensity].includes(topic.intensity ?? "safe")
  );
}
