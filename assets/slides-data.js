window.CMS_SLIDES = [
  {
    "title": "Wrist Acceleration and Heart Rate in Daily Life",
    "text": [
      "CMS6002 FRONTIERS OF ARTIFICIAL INTELLIGENCE · RESEARCH PROPOSAL",
      "A Synchronized Dataset and the Added Value of Agent-Generated Features",
      "How accurately can wrist motion estimate heart rate, and do features written by a language-model agent add anything?",
      "LU Zhengping",
      "The Hong Kong Polytechnic University · 22 November 2026"
    ],
    "notes": [],
    "image": "assets/slides/slide-01.webp"
  },
  {
    "title": "Heart rate from wrist motion, checked against ECG",
    "text": [
      "Many wrist devices record movement with an IMU over long periods. For studies that have only these acceleration records, how accurately can wrist motion be used to estimate heart rate?",
      "The planned study will recruit about 100 participants through a partner hospital. Each participant will be recorded over 10 consecutive days of ordinary daily life, for a planned 1,000 person-days (about 24,000 hours).",
      "Three signals recorded together. Wrist IMU acceleration is the model input. Wrist PPG is a comparison. The Polar H10 chest ECG provides the reference heart rate.",
      "Build a synchronized dataset and a benchmark. Reference heart rate from ECG for every window. Also recorded: clock agreement, usable data in each activity state, and baseline performance.",
      "Test what agent-generated features add. An agent writes feature code that runs locally, so it never sees raw participant data. Same regression, with and without the agent's features.",
      "Explore what wrist motion can reveal about the ECG waveform. Secondary analysis: generated against recorded ECG at three levels: heart rate, beat timing and waveform shape."
    ],
    "notes": [],
    "image": "assets/slides/slide-02.webp"
  },
  {
    "title": "Two clues in wrist motion, and what is still missing",
    "text": [
      "Heartbeat vibrations at rest. At rest, small vibrations from each heartbeat reach the wrist. BioWatch: 12 people at rest; MAE 1.27 bpm. Nightbeat: 42 participants, 310 hours overnight; 0.88 bpm. It is less clear how reliably wrist motion reveals individual beats while people move about during the day.",
      "Recent activity. Heart rate falls slowly after exercise, so two people sitting still can differ. A short sample of movement can miss this. Step2Heart: 280,000+ hours of daily life with chest-device heart rate. Readings at 15-second intervals show how heart rate relates to recent activity, not when each beat occurred.",
      "Datasets, agents, waveforms. PPG-DaLiA: 15 participants, set activities. WildPPG: 16 participants, about 13.5 hours each. Nightbeat-DB: nights only. CAAFE, DeepFeature: language models write feature code from task descriptions and feedback. VibCardiogram: ECG waveform from wrist motion, 20 participants.",
      "WHAT IS MISSING. Ten days per person with all three raw signals, and a test of what an agent adds to features that already cover both clues.",
      "Gap: Sleep, activity and transitions observed repeatedly in the same person, with raw IMU, PPG and ECG together."
    ],
    "notes": [],
    "image": "assets/slides/slide-03.webp"
  },
  {
    "title": "One main question, three research questions",
    "text": [
      "Does adding features designed by an agent improve heart rate estimates for a new participant when the model already has handcrafted features?",
      "RQ1. Data and measurement. How much of the planned ten days per participant is usable after clock alignment and quality checks? How does error vary with sleep, waking activity (low, medium or high) and transitions between states? In the same valid windows, how closely do the IMU baseline and wrist PPG each match ECG heart rate? Methodology 4.1 and 4.2.",
      "RQ2. Added predictive value. Does adding agent-generated features to the predefined set reduce heart rate error per participant? Is the gain consistent across sleep, waking activity and transitions? Does giving the agent information about physiology improve its performance? Methodology 4.3 and 4.4.",
      "RQ3. ECG generation. How closely does an end-to-end model that takes wrist motion as input reproduce ECG heart rate, beat timing and waveform shape? In which states can it locate individual beats, and in which only the overall heart rate? Methodology 4.5 · secondary."
    ],
    "notes": [],
    "image": "assets/slides/slide-04.webp"
  },
  {
    "title": "Data collection: about 100 people, ten days each",
    "text": [
      "The placement diagram shows a wristband on the non-dominant wrist and a Polar H10 strap on the chest. The wristband records three-axis acceleration and PPG. A phone logs the single-lead chest ECG.",
      "Hospital recruitment will run in five or six groups of about 20 people each.",
      "24-week study plan. Planned 16 Nov 2026 – 2 May 2027.",
      "Weeks 1–2. Hospital agreement and ethics application.",
      "Weeks 1–3. Confirm at least 20 device sets.",
      "Weeks 2–5. Test battery, export and clock sync.",
      "Weeks 2–6. Build the pipeline on public data.",
      "Weeks 7–8. Pilot after approval and fix quality limits.",
      "Weeks 9–11. Record groups 1 and 2.",
      "Weeks 12–13. Check data and continue recruiting.",
      "Weeks 14–18. Record the remaining groups.",
      "Week 19. Repeat recordings and archive data.",
      "Weeks 19–20. Check usable data and run baselines.",
      "Weeks 20–22. Generate ECG (secondary analysis).",
      "Weeks 21–23. Test H against H + A0 (main experiment).",
      "Weeks 20–24. Prepare the dataset guide and report.",
      "Set ECG quality and timing limits in week 8. Start analysis in week 19. Deliver results in week 24."
    ],
    "notes": [],
    "image": "assets/slides/slide-05.webp"
  },
  {
    "title": "Reference heart rate and activity states",
    "text": [
      "Each sample includes a ten-second window plus the previous ten minutes of three-axis acceleration. A window is excluded if the wristband was off at any point in those ten minutes.",
      "Align the clocks. Offsets against one reference clock; linear drift correction; three wrist taps at each end. Detect R peaks in the ECG with NeuroKit2. Clean the beats. Remove ectopic beats and artefacts (Lipponen and Tarvainen). Convert. The median R-R interval in the window gives the reference heart rate. Quality checks use the ECG only. Thresholds are fixed after the pilot.",
      "Sleep: Changes in wrist arm angle; diary bedtimes as a check.",
      "Low activity: Mean ENMO below 44.8 mg. Medium activity: 44.8 to 100.6 mg. High activity: Above 100.6 mg. Transition: First two minutes after a switch between low and high. Proposed cut-offs, checked for the study device in the pilot before they are fixed.",
      "REPORTED FOR EVERY STATE. Participants, share of usable windows, and error. If many high-activity windows fail the ECG check, a low error in the rest says little."
    ],
    "notes": [],
    "image": "assets/slides/slide-06.webp"
  },
  {
    "title": "Handcrafted features and the feature-writing agent",
    "text": [
      "The study records about 100 people for ten days each. Wrist acceleration is the model input, wrist PPG is an optical comparison, and chest ECG gives the reference heart rate.",
      "Left: split by participant. Keep all ten days for each person in the same group. Five folds rotate which participant group is held out.",
      "Middle: develop features using four groups. The agent sees the task, data format and training summaries, then writes Python code. The code runs locally. Validation error and code errors are returned for up to ten rounds. Code is selected before testing. The agent sees no raw signals or test data.",
      "Right: test on the held-out group using the same ten-second windows. The main experiment compares H with H plus A0 using ridge regression and per-person mean absolute error in beats per minute. The secondary analysis compares heart rate from generated ECG with direct heart rate prediction.",
      "H examples. Step rate and recent activity.",
      "A0 vs. A1. A0 uses standard instructions. A1 adds a fixed note on physiology."
    ],
    "notes": [],
    "image": "assets/slides/slide-07.webp"
  },
  {
    "title": "Main test: does H + A0 beat H in new participants?",
    "text": [
      "The diagram compares two routes from the same wrist acceleration. The top route uses handcrafted features H. The lower route adds agent features A0. Both ridge models are tested on the same people and windows.",
      "DECISION RULE. Per held-out participant: MAE of H + A0 (mean of three runs) minus MAE of H. Supports added value: upper 95% confidence limit of the mean difference below zero. Inconclusive: the interval includes zero. Paired bootstrap over participants; each participant counts equally.",
      "Four comparisons in Table 1. Main test: H + A0 vs. H. Features alone: A0 vs. H. Prompt effect: H + A1 vs. H + A0. Baseline: H vs. mean heart rate of each state. H: handcrafted features. A0, A1: agent features, standard or physiology prompt.",
      "WHERE DOES A GAIN COME FROM?. Two researchers sort each agent feature into five groups; agreement by Cohen's kappa. Remove one group and repeat on the same windows. Also reported: variation across runs, API cost, rounds and time."
    ],
    "notes": [],
    "image": "assets/slides/slide-08.webp"
  },
  {
    "title": "Secondary analysis: generating ECG from wrist motion",
    "text": [
      "In the diagram, both paths use the same wrist acceleration. The upper path generates an ECG and derives heart rate from the R peaks. The lower path predicts heart rate directly. Both estimates are checked against heart rate from the chest ECG.",
      "Input and output. 10 s of raw acceleration plus a downsampled previous 10 minutes. Output: a single-lead ECG. Candidate designs. Encoder–decoder network or conditional diffusion model, fixed on public and pilot data. Comparator. A two-branch regression network that predicts heart rate directly.",
      "Heart rate. From R peaks in the generated ECG. Assessed in all states with valid data.",
      "Beat timing. R-R intervals and R-wave timing. Sleep and low activity only, and only if clock alignment meets the preset tolerance.",
      "Waveform shape. Correlation and RMSE of the average beat shapes once beats are aligned.",
      "Fallback. If the pilot cannot confirm timing accuracy: window-level heart rate only, no claims about individual beats."
    ],
    "notes": [],
    "image": "assets/slides/slide-09.webp"
  },
  {
    "title": "What the project would contribute",
    "text": [
      "A common reference. An ECG heart rate for each valid window: IMU methods compared on the same basis. Shows how much usable, synchronized data one person gives across days and activities. Released with quality labels and the evaluation protocol, for participants who consent.",
      "Evidence that can be inspected. Every feature's code can be read; the error change is checked per participant. If H + A0 wins: results by state show where the gain comes from. If errors are similar: weigh the gain against development time and computing cost.",
      "Where it could be used. Acceleration-only cohorts: when can missing heart rate be estimated? IMU + PPG devices: where is less frequent PPG sampling worth testing? Energy savings would need a separate device study.",
      "Limit. Even with many recording windows, the number of participants limits what we can say about new users."
    ],
    "notes": [],
    "image": "assets/slides/slide-10.webp"
  },
  {
    "title": "Thank you",
    "text": [
      "Questions and comments are welcome",
      "LU Zhengping",
      "Wrist Acceleration and Heart Rate in Daily Life · CMS6002 Research Proposal"
    ],
    "notes": [],
    "image": "assets/slides/slide-11.webp"
  }
];
