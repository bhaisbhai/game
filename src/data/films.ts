export type Origin = 'Hollywood' | 'Bollywood' | 'UK' | 'Animation' | 'TV';
export type Genre = 'Action' | 'Drama' | 'Comedy' | 'Romance' | 'Horror' | 'Animation' | 'Thriller' | 'Sci-Fi' | 'Musical';
export type Decade = '90s' | '00s' | '90s-00s';

export interface FilmEntry {
  id: number;
  title: string;
  year: number;
  decade: Decade;
  origin: Origin;
  genre: Genre;
  // 5 emoji clues — vague → specific, revealed one at a time
  clues: [string, string, string, string, string];
  funFact: string;
}

// 60 films/shows covering Hollywood, Bollywood, UK & Animation from 90s–00s
// Clue design rule: clue 1 = vibe, clue 2 = key element, clue 3 = plot hint,
// clue 4 = iconic moment, clue 5 = basically the answer
export const FILMS: FilmEntry[] = [

  // ── HOLLYWOOD FILMS ─────────────────────────────────────────────────────
  {
    id: 1, title: 'The Matrix', year: 1999, decade: '90s',
    origin: 'Hollywood', genre: 'Sci-Fi',
    clues: ['💊', '🕶️', '🌧️💻', '🤖⚡', '🔴💊🔵💊'],
    funFact: 'Keanu Reeves learned over 200 martial arts moves for the film.'
  },
  {
    id: 2, title: 'Titanic', year: 1997, decade: '90s',
    origin: 'Hollywood', genre: 'Romance',
    clues: ['🌊', '🚢', '💎', '🧊💥', '🚢💔🧊'],
    funFact: 'Kate Winslet refused a wetsuit and caught pneumonia during filming.'
  },
  {
    id: 3, title: 'Jurassic Park', year: 1993, decade: '90s',
    origin: 'Hollywood', genre: 'Action',
    clues: ['🦕', '🧬', '🌴🌧️', '🦖😱', '🦕🧬🏝️🚗'],
    funFact: 'The T-Rex roar is a combination of a baby elephant, tiger, and alligator.'
  },
  {
    id: 4, title: 'Home Alone', year: 1990, decade: '90s',
    origin: 'Hollywood', genre: 'Comedy',
    clues: ['🏠', '❄️', '🎄😱', '👦🔒🏠', '👦😈✈️🎄'],
    funFact: "The film's budget was $18M. It made over $476M worldwide."
  },
  {
    id: 5, title: 'Forrest Gump', year: 1994, decade: '90s',
    origin: 'Hollywood', genre: 'Drama',
    clues: ['🏃', '🍫', '🪶✨', '🎖️🏓', '🏃🍫🪶🎖️'],
    funFact: 'Tom Hanks was paid $70M for the role through profit-sharing.'
  },
  {
    id: 6, title: 'Pulp Fiction', year: 1994, decade: '90s',
    origin: 'Hollywood', genre: 'Thriller',
    clues: ['💼', '🔫', '💉', '🕺💃', '💼🔫💉🕺'],
    funFact: 'The briefcase glow is never explained — Tarantino called it "whatever you want it to be."'
  },
  {
    id: 7, title: 'The Silence of the Lambs', year: 1991, decade: '90s',
    origin: 'Hollywood', genre: 'Thriller',
    clues: ['🦋', '🐑', '🔒😬', '🍷🧠', '🦋🐑🔪😬'],
    funFact: 'It is one of only three films to win all five major Academy Awards.'
  },
  {
    id: 8, title: 'Se7en', year: 1995, decade: '90s',
    origin: 'Hollywood', genre: 'Thriller',
    clues: ['7️⃣', '🌧️🔍', '😱📦', '💀7️⃣', '7️⃣🌧️📦😱'],
    funFact: '"What\'s in the box?!" — Brad Pitt improvised that line.'
  },
  {
    id: 9, title: 'Goodfellas', year: 1990, decade: '90s',
    origin: 'Hollywood', genre: 'Drama',
    clues: ['🤌', '🔫', '🍕', '🚬💰', '🤌🍕🔫🚬'],
    funFact: 'Joe Pesci wrote most of his own lines, including "funny how?"'
  },
  {
    id: 10, title: "Schindler's List", year: 1993, decade: '90s',
    origin: 'Hollywood', genre: 'Drama',
    clues: ['📋', '🔴🧥👧', '🏭', '🚂', '📋🏭🔴🧥'],
    funFact: "The red coat on the girl was the only colour in the film — Spielberg's most important creative decision."
  },
  {
    id: 11, title: 'Fight Club', year: 1999, decade: '90s',
    origin: 'Hollywood', genre: 'Thriller',
    clues: ['🧼', '💪', '🪥', '🏢💥', '🧼💪🏢💥😤'],
    funFact: 'There is a Starbucks cup visible in every single scene of the film.'
  },
  {
    id: 12, title: 'The Sixth Sense', year: 1999, decade: '90s',
    origin: 'Hollywood', genre: 'Thriller',
    clues: ['👻', '😨🧒', '🔴', '👀💀', '👻😨🧒🔴'],
    funFact: 'M. Night Shyamalan turned down $5M upfront to retain 10% of the gross — he earned over $80M.'
  },
  {
    id: 13, title: 'Scream', year: 1996, decade: '90s',
    origin: 'Hollywood', genre: 'Horror',
    clues: ['😱', '☎️', '🎭👻', '🔪🏠', '😱☎️🎭🔪'],
    funFact: 'Drew Barrymore was originally cast as the lead but chose to play the opening scene victim instead.'
  },
  {
    id: 14, title: 'Men in Black', year: 1997, decade: '90s',
    origin: 'Hollywood', genre: 'Sci-Fi',
    clues: ['🕴️', '🛸', '🕶️🌂', '👽☀️', '🕴️🛸👽🌂'],
    funFact: 'Will Smith turned down the lead role in Independence Day to make this film. Then he starred in both.'
  },
  {
    id: 15, title: 'Speed', year: 1994, decade: '90s',
    origin: 'Hollywood', genre: 'Action',
    clues: ['🚌', '💣', '⏱️', '🚌💣⏱️', '🚌💥💣⏱️🔫'],
    funFact: 'Keanu Reeves did many of his own stunts. The bus jump was real — no CGI.'
  },
  {
    id: 16, title: 'Gladiator', year: 2000, decade: '00s',
    origin: 'Hollywood', genre: 'Action',
    clues: ['⚔️', '🏟️', '🦅', '🌾👨‍👩‍👦', '⚔️🏟️🦅🌾'],
    funFact: 'Oliver Reed died during filming — CGI completed his remaining scenes.'
  },
  {
    id: 17, title: 'The Dark Knight', year: 2008, decade: '00s',
    origin: 'Hollywood', genre: 'Action',
    clues: ['🦇', '🃏', '🌃', '🔥😈', '🦇🃏🔥🌃'],
    funFact: "Heath Ledger stayed in a hotel room alone for 6 weeks developing the Joker's character."
  },
  {
    id: 18, title: 'Cast Away', year: 2000, decade: '00s',
    origin: 'Hollywood', genre: 'Drama',
    clues: ['🏝️', '🔥', '🏐', '🛩️💥', '🏝️🏐🔥🛩️'],
    funFact: "Tom Hanks gained 50 lbs then lost them for the film. Wilson the volleyball sold for $18,400 at auction."
  },
  {
    id: 19, title: 'The Notebook', year: 2004, decade: '00s',
    origin: 'Hollywood', genre: 'Romance',
    clues: ['📓', '🦆', '🌧️💕', '🏚️🌊', '📓🦆🌧️💕'],
    funFact: 'Ryan Gosling and Rachel McAdams famously hated each other on set. They later dated in real life.'
  },
  {
    id: 20, title: '8 Mile', year: 2002, decade: '00s',
    origin: 'Hollywood', genre: 'Drama',
    clues: ['🎤', '🏭', '🔥🎵', '🚗🌃', '🎤🏭🔥🎵🚗'],
    funFact: "Eminem's \"Lose Yourself\" was recorded in one day and won the Academy Award for Best Original Song."
  },
  {
    id: 21, title: 'Mean Girls', year: 2004, decade: '00s',
    origin: 'Hollywood', genre: 'Comedy',
    clues: ['💅', '🏫', '📓🔥', '👑🍕', '💅🏫📓🔥👑'],
    funFact: '"Fetch" was never going to happen — but it did. The word entered everyday language after this film.'
  },
  {
    id: 22, title: 'The Truman Show', year: 1998, decade: '90s',
    origin: 'Hollywood', genre: 'Drama',
    clues: ['📺', '🌅🎭', '🌊🛥️', '🚪', '📺🌅🌊🚪😮'],
    funFact: 'The film predicted reality TV before Big Brother or Survivor even existed.'
  },
  {
    id: 23, title: 'Clueless', year: 1995, decade: '90s',
    origin: 'Hollywood', genre: 'Comedy',
    clues: ['💅', '🎀', '📱', '🏫👑', '💅🎀📱🏫'],
    funFact: 'The film is loosely based on Jane Austen\'s Emma — set in Beverly Hills.'
  },
  {
    id: 24, title: 'Spider-Man', year: 2002, decade: '00s',
    origin: 'Hollywood', genre: 'Action',
    clues: ['🕷️', '🏙️', '📸', '🕸️', '🕷️🦸🏙️📸🕸️'],
    funFact: 'Tobey Maguire trained for 3 months to be able to catch the lunch tray in one take. He nailed it.'
  },
  {
    id: 25, title: 'Memento', year: 2000, decade: '00s',
    origin: 'Hollywood', genre: 'Thriller',
    clues: ['📸', '🖊️', '🔦', '🧠❓', '📸🖊️🧠❓🔄'],
    funFact: 'The film is told backwards — Christopher Nolan wrote it that way from the start.'
  },

  // ── BOLLYWOOD FILMS ────────────────────────────────────────────────────
  {
    id: 26, title: 'Dilwale Dulhania Le Jayenge', year: 1995, decade: '90s',
    origin: 'Bollywood', genre: 'Romance',
    clues: ['🌻', '🚆', '🇬🇧', '💑🎵', '🌻🚆🇬🇧💑'],
    funFact: 'DDLJ ran continuously at the Maratha Mandir cinema in Mumbai for over 25 years — a world record.'
  },
  {
    id: 27, title: 'Kuch Kuch Hota Hai', year: 1998, decade: '90s',
    origin: 'Bollywood', genre: 'Romance',
    clues: ['❤️', '🏫', '🏀', '💌', '❤️🏫🏀💌'],
    funFact: "Karan Johar's directorial debut. Shah Rukh Khan cried in 135 different shots."
  },
  {
    id: 28, title: 'Lagaan', year: 2001, decade: '00s',
    origin: 'Bollywood', genre: 'Drama',
    clues: ['🏏', '🌧️', '🇬🇧', '🌾', '🏏🌧️🇬🇧🌾'],
    funFact: 'Nominated for the Academy Award for Best Foreign Language Film. The cricket match took 40 days to film.'
  },
  {
    id: 29, title: 'Dil Chahta Hai', year: 2001, decade: '00s',
    origin: 'Bollywood', genre: 'Comedy',
    clues: ['🎭', '🇦🇺', '🚢', '👫👫👫', '🎭🇦🇺🚢👫'],
    funFact: "Farhan Akhtar's debut film. It redefined the modern Bollywood friendship film."
  },
  {
    id: 30, title: 'Kabhi Khushi Kabhie Gham', year: 2001, decade: '00s',
    origin: 'Bollywood', genre: 'Drama',
    clues: ['🏰', '✈️', '🇬🇧', '💑😭', '🏰✈️🇬🇧💑'],
    funFact: 'The film had a bigger opening weekend in the UK than in India when it released.'
  },
  {
    id: 31, title: 'Dil Se', year: 1998, decade: '90s',
    origin: 'Bollywood', genre: 'Thriller',
    clues: ['❤️🔥', '🚆', '💣', '🌧️💕', '❤️🔥🚆💣'],
    funFact: 'The Chaiyya Chaiyya sequence was filmed on top of a moving train.'
  },
  {
    id: 32, title: 'Kal Ho Naa Ho', year: 2003, decade: '00s',
    origin: 'Bollywood', genre: 'Romance',
    clues: ['❤️', '🌉', '😷💔', '🏙️', '❤️🌉😷🏙️'],
    funFact: "Set in New York — it was one of the first Bollywood films to use the city as a major backdrop."
  },
  {
    id: 33, title: '3 Idiots', year: 2009, decade: '00s',
    origin: 'Bollywood', genre: 'Comedy',
    clues: ['🎓', '📚', '😄', '🏔️', '🎓📚😄🏔️'],
    funFact: "The film was the highest-grossing Bollywood film of all time when it released."
  },
  {
    id: 34, title: 'Veer-Zaara', year: 2004, decade: '00s',
    origin: 'Bollywood', genre: 'Romance',
    clues: ['🌹', '🇮🇳', '🇵🇰', '💌', '🌹🇮🇳🇵🇰💌'],
    funFact: "Yash Chopra's final film as director. Filming was delayed by 16 years before completion."
  },
  {
    id: 35, title: 'Jab We Met', year: 2007, decade: '00s',
    origin: 'Bollywood', genre: 'Romance',
    clues: ['🚆', '📞', '💃', '🏔️', '🚆📞💃🏔️'],
    funFact: 'Kareena Kapoor improvised most of her Geet dialogue — very few scenes were scripted.'
  },
  {
    id: 36, title: 'Om Shanti Om', year: 2007, decade: '00s',
    origin: 'Bollywood', genre: 'Drama',
    clues: ['🎬', '🔥', '👻', '💃🎭', '🎬🔥👻💃'],
    funFact: "Shah Rukh Khan's six-pack abs were the first time he'd shown them onscreen. He trained for 8 months."
  },
  {
    id: 37, title: 'Rang De Basanti', year: 2006, decade: '00s',
    origin: 'Bollywood', genre: 'Drama',
    clues: ['✊', '🇮🇳', '🎵', '💔', '✊🇮🇳🎵💔'],
    funFact: "The film inspired real-life protests in India after the Jessica Lal murder verdict."
  },
  {
    id: 38, title: 'Taare Zameen Par', year: 2007, decade: '00s',
    origin: 'Bollywood', genre: 'Drama',
    clues: ['🎨', '👦', '✏️', '❤️', '🎨👦✏️❤️'],
    funFact: "Aamir Khan directed the film anonymously. The boy in the film, Darsheel Safary, was 9 during filming."
  },
  {
    id: 39, title: 'Hum Aapke Hain Koun', year: 1994, decade: '90s',
    origin: 'Bollywood', genre: 'Musical',
    clues: ['💒', '👨‍👩‍👧‍👦', '🎊', '🐕', '💒👨‍👩‍👧‍👦🎊🐕'],
    funFact: "At the time, it was India's highest-grossing film ever. It ran for 3 years continuously in some cinemas."
  },
  {
    id: 40, title: 'Taal', year: 1999, decade: '90s',
    origin: 'Bollywood', genre: 'Musical',
    clues: ['🎵', '🏔️', '🎸', '💃', '🎵🏔️🎸💃'],
    funFact: "The first Bollywood film to enter Billboard's pop charts in the US."
  },
  {
    id: 41, title: 'Devdas', year: 2002, decade: '00s',
    origin: 'Bollywood', genre: 'Drama',
    clues: ['🍶', '💔', '💃', '😢🌧️', '🍶💔💃😢'],
    funFact: "Sanjay Leela Bhansali's costumes cost ₹10 crore alone — a record at the time."
  },
  {
    id: 42, title: 'Koi... Mil Gaya', year: 2003, decade: '00s',
    origin: 'Bollywood', genre: 'Sci-Fi',
    clues: ['👽', '🇮🇳', '💙', '🏔️', '👽🇮🇳💙🏔️'],
    funFact: "India's first major sci-fi superhero franchise. The alien Jadoo weighed 1.5 tonnes of props."
  },

  // ── UK FILMS ──────────────────────────────────────────────────────────
  {
    id: 43, title: 'Trainspotting', year: 1996, decade: '90s',
    origin: 'UK', genre: 'Drama',
    clues: ['💉', '🚽', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '😵', '💉🚽🏴󠁧󠁢󠁳󠁣󠁴󠁿😵'],
    funFact: "Ewan McGregor had to be supervised during the toilet dive scene — the set smelled horrific."
  },
  {
    id: 44, title: 'Lock, Stock and Two Smoking Barrels', year: 1998, decade: '90s',
    origin: 'UK', genre: 'Action',
    clues: ['🔫🔫', '🃏', '💰', '🇬🇧', '🔫🔫🃏💰🇬🇧'],
    funFact: "Guy Ritchie made the film for £1M. Madonna was in the sequel, and then married him."
  },
  {
    id: 45, title: 'Bend It Like Beckham', year: 2002, decade: '00s',
    origin: 'UK', genre: 'Comedy',
    clues: ['⚽', '🇬🇧🇮🇳', '👩‍👩', '🏆', '⚽🇬🇧🇮🇳👩‍👩🏆'],
    funFact: "The film beat Spider-Man at the UK box office in its opening weekend."
  },
  {
    id: 46, title: "Bridget Jones's Diary", year: 2001, decade: '00s',
    origin: 'UK', genre: 'Comedy',
    clues: ['📓', '🍷', '❄️', '🇬🇧', '📓🍷❄️🇬🇧'],
    funFact: "Renée Zellweger worked as a temp at a London publishing house for 3 weeks to prepare for the role."
  },
  {
    id: 47, title: 'Slumdog Millionaire', year: 2008, decade: '00s',
    origin: 'UK', genre: 'Drama',
    clues: ['💰', '🏚️', '❤️', '🎰', '💰🏚️❤️🎰'],
    funFact: "Won 8 Academy Awards including Best Picture. The child actors were from the Dharavi slum in Mumbai."
  },
  {
    id: 48, title: 'Billy Elliot', year: 2000, decade: '00s',
    origin: 'UK', genre: 'Drama',
    clues: ['🩰', '🥊', '🏭', '🇬🇧', '🩰🥊🏭🇬🇧'],
    funFact: "Jamie Bell beat 2,000 other boys for the role. He had never acted before."
  },
  {
    id: 49, title: 'Four Weddings and a Funeral', year: 1994, decade: '90s',
    origin: 'UK', genre: 'Romance',
    clues: ['💒', '🌂', '🇬🇧', '💔', '💒🌂🇬🇧💔💕'],
    funFact: "Hugh Grant became an international star overnight. The film cost £3M and made £245M worldwide."
  },
  {
    id: 50, title: 'Notting Hill', year: 1999, decade: '90s',
    origin: 'UK', genre: 'Romance',
    clues: ['🌸', '🎥', '🏡', '🇬🇧', '🌸🎥🏡🇬🇧'],
    funFact: "Julia Roberts was paid $15M — the highest fee for an actress at the time."
  },

  // ── TV SHOWS (US & UK) ────────────────────────────────────────────────
  {
    id: 51, title: 'Friends', year: 1994, decade: '90s-00s',
    origin: 'TV', genre: 'Comedy',
    clues: ['☕', '🛋️', '🏙️', '👫👫👫', '☕🛋️🏙️❤️'],
    funFact: 'The cast negotiated together for pay rises — by the end they each earned $1M per episode.'
  },
  {
    id: 52, title: 'The Fresh Prince of Bel-Air', year: 1990, decade: '90s',
    origin: 'TV', genre: 'Comedy',
    clues: ['👑', '🏀', '🏡', '🚕', '👑🏀🏡🚕'],
    funFact: "Will Smith was actually broke and near bankruptcy when he got the role — the show saved his career."
  },
  {
    id: 53, title: 'Sister Sister', year: 1994, decade: '90s',
    origin: 'TV', genre: 'Comedy',
    clues: ['👯', '🛍️', '📚', '😄', '👯🛍️📚😄'],
    funFact: "Tia and Tamera Mowry are real-life twins. The show was cancelled after Season 2 then picked up by The WB."
  },
  {
    id: 54, title: 'Neighbours', year: 1985, decade: '90s-00s',
    origin: 'TV', genre: 'Drama',
    clues: ['🏡', '🇦🇺', '🌞', '💑', '🏡🇦🇺🌞💑'],
    funFact: "Kylie Minogue and Jason Donovan both launched music careers from this show."
  },
  {
    id: 55, title: 'Kenan & Kel', year: 1996, decade: '90s',
    origin: 'TV', genre: 'Comedy',
    clues: ['🧴', '😂', '🍔', '🏪', '🧴😂🍔🏪'],
    funFact: '"Who loves orange soda? Kel loves orange soda!" — Kel really does love orange soda in real life.'
  },
  {
    id: 56, title: 'Saved by the Bell', year: 1989, decade: '90s',
    origin: 'TV', genre: 'Comedy',
    clues: ['🏫', '📱', '😎', '💃', '🏫📱😎💃'],
    funFact: "Zack Morris's brick phone is the most iconic prop in teen TV history. It was an actual working phone."
  },
  {
    id: 57, title: 'Buffy the Vampire Slayer', year: 1997, decade: '90s-00s',
    origin: 'TV', genre: 'Action',
    clues: ['🧛', '🏫', '⚰️', '💪👧', '🧛🏫⚰️💪'],
    funFact: "Joss Whedon invented the term 'Big Bad' for Buffy — it is now used widely in TV criticism."
  },
  {
    id: 58, title: 'The X-Files', year: 1993, decade: '90s',
    origin: 'TV', genre: 'Thriller',
    clues: ['👽', '🔦', '🛸', '🕵️‍♀️🕵️', '👽🔦🛸❓'],
    funFact: "\"The truth is out there\" — the tagline became a cultural phrase. The FBI saw a surge in applications."
  },
  {
    id: 59, title: 'The Sopranos', year: 1999, decade: '90s-00s',
    origin: 'TV', genre: 'Drama',
    clues: ['🍕', '🔫', '🦢', '🛋️', '🍕🔫🦢🛋️'],
    funFact: "Tony feeding the ducks in the pilot was improvised by James Gandolfini — and it defined the character."
  },

  // ── ANIMATION ─────────────────────────────────────────────────────────
  {
    id: 60, title: 'The Lion King', year: 1994, decade: '90s',
    origin: 'Animation', genre: 'Animation',
    clues: ['🦁', '👑', '🌅', '⭐', '🦁👑🌅⭐'],
    funFact: "The wildebeest stampede took three years to animate. Jeremy Irons recorded Scar\'s lines in one take."
  },
  {
    id: 61, title: 'Toy Story', year: 1995, decade: '90s',
    origin: 'Animation', genre: 'Animation',
    clues: ['🤠', '🚀', '🧸', '🌟', '🤠🚀🧸🌟'],
    funFact: 'The first entirely CGI feature film ever made. Pixar had only 110 employees at the time.'
  },
  {
    id: 62, title: 'Mulan', year: 1998, decade: '90s',
    origin: 'Animation', genre: 'Animation',
    clues: ['⚔️', '🏮', '🐉', '🪭', '⚔️🏮🐉🪭'],
    funFact: "Mulan is the only Disney princess to save her country, not just herself."
  },
  {
    id: 63, title: 'Shrek', year: 2001, decade: '00s',
    origin: 'Animation', genre: 'Animation',
    clues: ['🧅', '🫏', '🏰', '🐈', '🧅🫏🏰🐈'],
    funFact: '"Ogres are like onions" — Mike Myers re-recorded all of Shrek\'s dialogue in a Scottish accent after shooting.'
  },
  {
    id: 64, title: 'Finding Nemo', year: 2003, decade: '00s',
    origin: 'Animation', genre: 'Animation',
    clues: ['🐠', '🌊', '🦈', '🐢', '🐠🌊🦈🐢'],
    funFact: "Albert Brooks improvised over 90% of Marlin's dialogue. The ocean scenes used real marine data."
  },
  {
    id: 65, title: 'The Incredibles', year: 2004, decade: '00s',
    origin: 'Animation', genre: 'Animation',
    clues: ['🦸', '👨‍👩‍👦', '🔥', '⚡', '🦸👨‍👩‍👦🔥⚡'],
    funFact: '"Where is my supersuit?!" — Samuel L. Jackson recorded all his lines in two days.'
  },
];

// All titles in one flat list for autocomplete search
export const ALL_TITLES = FILMS.map(f => f.title);
