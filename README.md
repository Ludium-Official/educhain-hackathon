![ludium-educhain.png](https://cdn.dorahacks.io/static/files/191515946df7ca85aa086294a18b0111.png)

# Web3 Calls for a Radical Turnover In Education
Traditionally, educational system was dictated by the structure of institutions such as colleges and other subsidiary organizations. However, in Web3 global foundations strive to provide community driven educational programs that **increase** **accessibility, diversity, and opportunity** tailored to the local needs. Most of the community driven educational programs are partially subsidized by different Grants and Public Goods Funding similar to how Government support the educational institution. However, since it is intended to be more **open, transparent, and public** in nature, the foundation needs to manage many more individuals and small communities at once.

# The Lack of System Makes It Difficult to Run the Program
Although the level of engagement from student clubs and local communities are growing, there is a lack of system which makes the program management difficult
- For Sponsors: It is difficult to find a system to set up edu bounty program in a permissionless manner and unable to effortlessly manage the results that comes from all the different bounty programs
- For Operators: It takes long time to search for sponsors and write the proposal. Even if the program is in action, reporting the results, validating it, and getting paid takes months 
It requires a system that manages edu bounty programs such that community driven local programs can be manged in a **open, permissionless, and transparent** manner.

# Introducing Ludium: Edu Bounty Management System
![스크린샷 2024-08-14 오후 10.27.48.png](https://i.ibb.co/x7LJNXT/2024-08-14-10-27-48.png)[Ludium's Edu Bounty Management System](https://edupyramid.online/)[ ](http://hackathemy.me:3002/profile)is designed to help community education program operators and their sponsors to run the program more easily. It includes three primary features

- Setup Program: Anyone can become a sponsor to setup a bounty based program that includes description, prize, and type. The sponsor can also designate a validator to verify if the requirement is met.
- Provide Incentive: Operators and participants can submit mission via program to be validated for completion. Once the validation is complete, payment can be processed directly as long as the sponsor agrees to sign it. It takes much less time to process the payment that requires finance team to authorize the process.
- Manage Program: Sponsor can view all the different missions that were submitted on the profile directly. In this way, operators no longer need to submit additional report to prove their milestone. On the other hand, sponsors can readily analyze the effectiveness of the different programs.

# Onchain Program Contract
![Ludium Program Contract](https://cdn.dorahacks.io/static/files/19187470a697e2d6ce71fb04f38841ad.png)
The heart of Ludium's program management is onchain contract that consists of four parts
- LD_ProgramFactory: Contract creating contract that creates a program proxy contract for the amount of bounty that is initially put in
- Mission/Validator: Missions are tasks that can be submitted and verified for the program that finalizes the payment. Mission payment must be signed by the validator designated by the program owner
- LD_EventLogger: The contract logger that keeps track of the events from the programs including amount claimed / to whom, who's the validator, and how many missions are submitted
- LD_Tresury: Treasury is the onchain fee collecting contract for all programs that are created. The treasury can be used for the sustainability of the Ludium's development

# Use Cases
Ludium's edu bounty management system can be used in the following cases:
- Documentation: Open source collaboration for builder resources and educational materials. It is especially effective if it requires translation because it involves local community participation
- Lecture Operation: Community driven on/offline educational lectures for developer onboarding. KPI based payment approach (ex. Payment per mission completion) proved to be effective
- Hackathons / Contests: Program factory can be used for hackathon payment solutions for both the operators and prize winners so that more vibrant, diverse contests can sprout
- Dev Bounty / Grants: Foundation can delegate the bounty operation to more local communities with closer builder touch points. Bounty / Grants can further develop into Incubation stage of startup discovery

# Go To Market Strategy
Ludium consists of 1,800 builders with more than 100 + programs and 400K + bounty payment. The most immediate strategy is to reshape the system so that all the community builders, including student clubs, can onboard onto the system without any difficulty.

For Q4, Ludium's focus will include the followings:
- Global Community Onboarding: As of now, Ludium's community programs are focused on Korean Builders. ([See Example](https://docs.google.com/presentation/d/1aRUhaZzvjIUrL3JK9VZ-TjZOB37HDcARzUHMYBDA4QE/edit?usp=sharing)) For next year, however, Ludium plans to launch a program to bring 100 builders to visit Korea for a Global Contest. For this, activation must start from Q4 2024
- Reputation System: For individuals and small communities, it is the most crucial to leave a meaningful reputation on the system. It also helps sponsors select who to work with
- Incentive System Development: The current incentive mechanism is very simple in terms of validation / direct payment. However, with the logger system, it is possible to enhance the incentive mechanisms for Proactive (eg. QF), and Retroactive (eg. contribution scoring) activities
