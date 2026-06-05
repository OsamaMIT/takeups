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
  ["Absurd Everyday Takes", "absurd", "Is a shopping cart a temporary vehicle?", "Yes. It has wheels, cargo, and bad drivers.", "No. Vehicles do not live in parking lot herds."],
  ["Absurd Everyday Takes", "safe", "Should elevator music be legally required?", "Yes. Silence in elevators is too powerful.", "No. We should not soundtrack vertical waiting."],
  ["Absurd Everyday Takes", "spicy", "Is making the bed pointless?", "Yes. It is a daily reset of a temporary exhibit.", "No. The bed must know who is in charge."],
  ["Absurd Everyday Takes", "safe", "Should umbrellas have headlights?", "Yes. Rain turns sidewalks into stealth missions.", "No. Umbrellas should not become small cars."],
  ["Absurd Everyday Takes", "absurd", "Are pigeons just city interns?", "Yes. They attend every meeting and do nothing.", "No. Interns usually understand doors."],
  ["Absurd Everyday Takes", "safe", "Should doors say push or pull out loud?", "Yes. Society needs fewer glass-door defeats.", "No. Doors should test character quietly."],
  ["Absurd Everyday Takes", "safe", "Is laundry a subscription service?", "Yes. It renews weekly without consent.", "No. Subscriptions at least send emails."],
  ["Absurd Everyday Takes", "spicy", "Should alarm clocks apologize?", "Yes. They commit emotional damage daily.", "No. They are the only honest device."],
  ["Absurd Everyday Takes", "absurd", "Should every couch have a formal name?", "Yes. We spend too much time together for anonymity.", "No. Furniture should not outrank guests."],
  ["Absurd Everyday Takes", "safe", "Is a hallway just a room with commitment issues?", "Yes. It exists but refuses furniture.", "No. Hallways are roads wearing carpet."],
  ["Absurd Everyday Takes", "spicy", "Should everyone own one dramatic cape?", "Yes. Errands need higher production value.", "No. Grocery aisles cannot handle that wind resistance."],

  ["Food Crimes", "safe", "Is cereal soup?", "Yes. Cereal is soup.", "No. Cereal is not soup."],
  ["Food Crimes", "spicy", "Should pizza be eaten with a fork?", "Yes. Civilization begins at the utensil.", "No. Pizza was built for direct contact."],
  ["Food Crimes", "safe", "Are fries a main course?", "Yes. Fries are potatoes with ambition.", "No. Fries are supporting actors with salt."],
  ["Food Crimes", "absurd", "Should ketchup be considered a smoothie?", "Yes. It is blended tomato confidence.", "No. Smoothies should not haunt hot dogs."],
  ["Food Crimes", "spicy", "Is pineapple on pizza elite?", "Yes. Sweet and salty is strategic warfare.", "No. Fruit should file a permit first."],
  ["Food Crimes", "safe", "Should sandwiches be cut diagonally?", "Yes. Triangles taste more expensive.", "No. Rectangles respect structural integrity."],
  ["Food Crimes", "spicy", "Is room-temperature pizza superior?", "Yes. It becomes stable and honest.", "No. Cold cheese is a warning sign."],
  ["Food Crimes", "safe", "Are pancakes just breakfast cake?", "Yes. Syrup is frosting with better marketing.", "No. Cake does not need a skillet passport."],
  ["Food Crimes", "absurd", "Should soup be drinkable through a straw?", "Yes. Efficiency demands broth pipelines.", "No. A straw in soup is culinary espionage."],
  ["Food Crimes", "safe", "Is a hot dog a sandwich?", "Yes. Bread surrounds filling. Case closed.", "No. A hinge bun creates its own category."],
  ["Food Crimes", "spicy", "Should coffee count as breakfast?", "Yes. It is bean soup with purpose.", "No. Breakfast should not be a liquid panic button."],
  ["Food Crimes", "safe", "Are cupcakes muffins in formalwear?", "Yes. Frosting is just a tiny tuxedo.", "No. Muffins have never known glamour."],
  ["Food Crimes", "absurd", "Should salad have a crunch quota?", "Yes. Leaves need performance metrics.", "No. Vegetables should not be audited."],

  ["Social Etiquette", "safe", "Should voice notes require appointments?", "Yes. Audio ambushes are poor governance.", "No. Voice notes are democracy with breathing."],
  ["Social Etiquette", "spicy", "Is replying 'haha' legally sufficient?", "Yes. It closes the emotional loop.", "No. The conversation deserves evidence of laughter."],
  ["Social Etiquette", "safe", "Should group chats have office hours?", "Yes. Notifications need boundaries.", "No. Chaos is the point of a group chat."],
  ["Social Etiquette", "spicy", "Is being five minutes late basically on time?", "Yes. Time has soft edges.", "No. Clocks were invented for a reason."],
  ["Social Etiquette", "safe", "Should small talk have a time limit?", "Yes. Weather analysis should expire.", "No. Small talk is society's loading screen."],
  ["Social Etiquette", "absurd", "Should awkward silences be scored by judges?", "Yes. Some pauses are technically impressive.", "No. Silence should not get a leaderboard."],
  ["Social Etiquette", "safe", "Should people announce when they leave a party?", "Yes. Disappearing is dramatic and inefficient.", "No. The quiet exit is an art form."],
  ["Social Etiquette", "spicy", "Is double texting a power move?", "Yes. Momentum respects no queue.", "No. Messages need personal space."],
  ["Social Etiquette", "safe", "Should handshakes be retired?", "Yes. The nod can carry the institution.", "No. Business needs one tiny contest."],
  ["Social Etiquette", "absurd", "Should every meeting start with a verdict?", "Yes. Save time by deciding first.", "No. Meetings need suspense to survive."],
  ["Social Etiquette", "safe", "Is 'no worries' secretly powerful?", "Yes. It ends conflicts with velvet.", "No. It hides too much mystery."],
  ["Social Etiquette", "spicy", "Should unread messages expire?", "Yes. Ghosts need a statute of limitations.", "No. Some texts must age like evidence."],
  ["Social Etiquette", "safe", "Is leaving a cart in the aisle a public statement?", "Yes. It declares war on circulation.", "No. It is temporary logistics."],

  ["Pop Culture Logic", "safe", "Should movie trailers reveal nothing?", "Yes. A trailer should be a locked door.", "No. People need at least one explosion receipt."],
  ["Pop Culture Logic", "spicy", "Are spoilers useful?", "Yes. They protect time and lower stress.", "No. Spoilers are narrative theft."],
  ["Pop Culture Logic", "safe", "Should villains get customer-service training?", "Yes. Better communication could solve act two.", "No. Villains should not optimize their brand."],
  ["Pop Culture Logic", "absurd", "Should every show have one courtroom episode?", "Yes. All stories need legal pressure.", "No. Even sitcom couches need rest."],
  ["Pop Culture Logic", "safe", "Are side characters usually right?", "Yes. They see the plot from a safer distance.", "No. Main characters carry the burden of chaos."],
  ["Pop Culture Logic", "spicy", "Should opening credits be skippable by law?", "Yes. The remote deserves rights.", "No. Credits are the ritual gate."],
  ["Pop Culture Logic", "safe", "Is a reboot better than a sequel?", "Yes. Reset the mess and keep the theme.", "No. Consequences should survive branding."],
  ["Pop Culture Logic", "absurd", "Should every action hero file expense reports?", "Yes. Property damage needs paperwork.", "No. Explosions lose charm under accounting."],
  ["Pop Culture Logic", "safe", "Are subtitles always better?", "Yes. Dialogue deserves backup.", "No. Eyes should be free to roam."],
  ["Pop Culture Logic", "spicy", "Should cliffhangers be taxed?", "Yes. Emotional debt has a cost.", "No. Suspense keeps civilization alert."],
  ["Pop Culture Logic", "safe", "Is background music manipulative?", "Yes. Strings are emotional lobbying.", "No. Scenes need atmosphere to breathe."],
  ["Pop Culture Logic", "absurd", "Should fictional restaurants pass health inspections?", "Yes. Immersion includes food safety.", "No. Imaginary kitchens can be lawless."],
  ["Pop Culture Logic", "safe", "Are remixes better than originals?", "Yes. Revision is artistic democracy.", "No. The first version owns the lightning."],

  ["Tech & Internet", "safe", "Should phones have a boredom mode?", "Yes. The rectangle is too persuasive.", "No. Boredom should not need software."],
  ["Tech & Internet", "spicy", "Is inbox zero suspicious?", "Yes. No normal person defeats email.", "No. It is digital hygiene with receipts."],
  ["Tech & Internet", "safe", "Should autocorrect have to explain itself?", "Yes. It owes testimony for every betrayal.", "No. Autocorrect works under pressure."],
  ["Tech & Internet", "absurd", "Are passwords just tiny curses?", "Yes. We whisper them to open gates.", "No. Curses rarely require punctuation."],
  ["Tech & Internet", "spicy", "Should all apps have quiet mode by default?", "Yes. Notifications are tiny doorbells.", "No. Apps must announce their existence."],
  ["Tech & Internet", "safe", "Is the cloud just someone else's attic?", "Yes. We store things in a mystery ceiling.", "No. Attics do not have uptime dashboards."],
  ["Tech & Internet", "absurd", "Should loading bars be legally honest?", "Yes. 99% should not be a cliff.", "No. Mystery is part of computing tradition."],
  ["Tech & Internet", "safe", "Are screenshots modern note-taking?", "Yes. Capture first, understand later.", "No. Notes require thoughts, not panic images."],
  ["Tech & Internet", "spicy", "Should typing indicators be banned?", "Yes. Three dots are psychological theater.", "No. Suspense improves messaging."],
  ["Tech & Internet", "safe", "Is dark mode a personality trait?", "Yes. It signals serious screen discipline.", "No. It is just less light."],
  ["Tech & Internet", "absurd", "Should printers require a therapist?", "Yes. They clearly process conflict poorly.", "No. Printers choose violence deliberately."],
  ["Tech & Internet", "safe", "Are browser tabs a to-do list?", "Yes. Every tab is a small promise.", "No. Tabs are abandoned digital furniture."],
  ["Tech & Internet", "spicy", "Should people narrate calendar invites?", "Yes. Context prevents meeting crimes.", "No. The title is enough evidence."],

  ["School / Work Chaos", "safe", "Should meetings have a maximum number of chairs?", "Yes. Chairs invite unnecessary opinions.", "No. Standing meetings are a threat."],
  ["School / Work Chaos", "spicy", "Is 'quick question' ever quick?", "Yes. Some people respect the adjective.", "No. It is the opening line of a saga."],
  ["School / Work Chaos", "safe", "Should homework have trailers?", "Yes. Students deserve a preview of pain.", "No. Suspense is part of education."],
  ["School / Work Chaos", "absurd", "Should spreadsheets have theme music?", "Yes. Data entry needs cinematic stakes.", "No. Cells should suffer in silence."],
  ["School / Work Chaos", "spicy", "Is a standing desk a personality?", "Yes. It changes how people enter rooms.", "No. It is furniture with height settings."],
  ["School / Work Chaos", "safe", "Should all deadlines be at noon?", "Yes. Midnight is dramatic and rude.", "No. Night deadlines reveal commitment."],
  ["School / Work Chaos", "absurd", "Should project names be judged before approval?", "Yes. Bad names drain morale.", "No. Results matter more than labels."],
  ["School / Work Chaos", "safe", "Are office snacks a form of diplomacy?", "Yes. Granola bars prevent unrest.", "No. Snacks cannot replace decisions."],
  ["School / Work Chaos", "spicy", "Should cameras be off by default?", "Yes. Faces are not always required data.", "No. Meetings need visible accountability."],
  ["School / Work Chaos", "safe", "Is a backpack just a portable drawer?", "Yes. It carries chaos with straps.", "No. Drawers do not ruin posture."],
  ["School / Work Chaos", "absurd", "Should slide decks have speed limits?", "Yes. Transitions can become traffic hazards.", "No. Slides need freedom to accelerate."],
  ["School / Work Chaos", "safe", "Should lunch breaks be renamed recovery periods?", "Yes. The body is rebooting.", "No. Lunch should not sound medical."],
  ["School / Work Chaos", "spicy", "Is multitasking a myth?", "Yes. It is task-switching with confidence.", "No. Some minds run many tabs cleanly."],

  ["Philosophical Nonsense", "safe", "If a chair is uncomfortable, is it still a chair?", "Yes. Failure does not erase identity.", "No. A chair must honor the sit."],
  ["Philosophical Nonsense", "absurd", "Can a sandwich be brave?", "Yes. Structural collapse requires courage.", "No. Bread cannot possess virtue."],
  ["Philosophical Nonsense", "safe", "Is waiting a hobby?", "Yes. People practice it constantly.", "No. Hobbies require consent."],
  ["Philosophical Nonsense", "spicy", "Is being right overrated?", "Yes. Peace often beats accuracy.", "No. Reality should not lose the debate."],
  ["Philosophical Nonsense", "safe", "Does a to-do list create more work?", "Yes. Naming tasks gives them power.", "No. The work already existed quietly."],
  ["Philosophical Nonsense", "absurd", "Are stairs a negotiation with gravity?", "Yes. Every step is a treaty.", "No. Gravity never signed anything."],
  ["Philosophical Nonsense", "safe", "Can a room have a mood?", "Yes. Lighting is emotional architecture.", "No. Rooms are innocent containers."],
  ["Philosophical Nonsense", "spicy", "Is confidence just volume with posture?", "Yes. Presentation does most of the work.", "No. Confidence has internal paperwork."],
  ["Philosophical Nonsense", "safe", "Is a shortcut still a shortcut if everyone uses it?", "Yes. Efficiency scales.", "No. Popular shortcuts become roads."],
  ["Philosophical Nonsense", "absurd", "Should mirrors be considered witnesses?", "Yes. They see everything and say nothing.", "No. Reflection is not testimony."],
  ["Philosophical Nonsense", "safe", "Can silence be an answer?", "Yes. It is punctuation with courage.", "No. Answers need content."],
  ["Philosophical Nonsense", "spicy", "Is planning just procrastination in formal clothes?", "Yes. It delays action politely.", "No. Planning is action with a map."],
  ["Philosophical Nonsense", "absurd", "Are elevators tiny rooms with destinations?", "Yes. They hold meetings with gravity.", "No. Rooms do not arrive."],

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
