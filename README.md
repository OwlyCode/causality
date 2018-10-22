Core features
- Add time-rewrite feature
- Add the ability to manually use a seed

Non-core features
- Rework the battle system
- Improve name generator
- Add random facts
	- scientific discoveries related to the current era
	- facts about the politics/economics

Bugfix
- Fix canOccurOnce
- Fix minification by stopping using constructorName

DX
- Make world immutable and store a copy of each world associated with a fact.
- Add the list of probability for each next event in debug mode
- Improve the way to have multiple text
- Improve features (use an object ?)
- Improve the way to handle outcomes
- Expose world.random as a public readonly
- Add a long-term memory version of 'pick', it will pick a value ONCE in the whole story.
	-> Maybe add a world.setPool('poolName', [values]) and world.getPoolSize() for scoring on it.
	-> Could be "pick_pool(2): poolName" in the rules