import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const password = "12345678";
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database to match current schema...");
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = await prisma.role.createManyAndReturn({
        data: [{ name: "ADMIN" }, { name: "USER" }],
    });

    const membership = await prisma.membership.createManyAndReturn({
        data: [
            {
                package: "A",
                articleLimit: 5,
                videoLimit: 5,
            },
            {
                package: "B", 
                articleLimit: 10,
                videoLimit: 10,
            },
            {
                package: "C",
                articleLimit: null, // unlimited
                videoLimit: null, // unlimited
            },
        ],
    });

    const user = await prisma.user.createManyAndReturn({
        data: [
            {
                email: "alice@example.com",
                password: hashedPassword,
                firstName: "Alice",
                lastName: "Wonderland",
                roleId: role[0]!.id,
                membershipId: membership[0]!.id,
            },
            {
                email: "bob@example.com",
                password: hashedPassword,
                firstName: "Bob",
                lastName: "Builder",
                roleId: role[1]!.id,
                membershipId: membership[1]!.id,
            },
        ],
    });

    await prisma.article.createMany({
        data: [
            {
                thumbnail: "https://picsum.photos/seed/article1/400/250",
                title: "Getting Started with Video Production",
                content: "Video production is an art form that combines technical skills with creative vision. Whether you're creating content for entertainment, education, or marketing, understanding the fundamentals is crucial.\n\nKey aspects of video production include:\n- Pre-production planning and scripting\n- Camera work and lighting techniques\n- Audio recording and post-production\n- Editing and color correction\n- Distribution and audience engagement\n\nThe journey from concept to final product requires patience, practice, and continuous learning. Modern tools have made video production more accessible than ever, but the principles of good storytelling remain constant.",
                authorId: user[0]!.id,
            },
            {
                thumbnail: "https://picsum.photos/seed/article2/400/250",
                title: "The Art of Animation: From Blender to Big Screen",
                content: "Animation has evolved tremendously over the past decades. Open-source tools like Blender have democratized the animation industry, allowing independent creators to produce Hollywood-quality content.\n\nBlender Foundation's open movies like 'Big Buck Bunny', 'Elephant Dreams', 'Sintel', and 'Tears of Steel' have shown what's possible with open-source animation tools. These projects not only entertain but also serve as benchmarks for the software's capabilities.\n\nKey lessons from these productions:\n- Community collaboration drives innovation\n- Open-source doesn't mean lower quality\n- Creative storytelling transcends budget constraints\n- Technical advancement through real-world projects\n\nThese animated shorts continue to inspire creators worldwide and demonstrate the power of collective creativity.",
                authorId: user[1]!.id,
            },
            {
                thumbnail: "https://picsum.photos/seed/article3/400/250", 
                title: "Automotive Entertainment: The Rise of Car Review Shows",
                content: "The automotive entertainment industry has found a new home on digital platforms. Shows like 'The Smoking Tire' have revolutionized how we consume car-related content, moving beyond traditional television formats.\n\nThis shift has brought several advantages:\n- More authentic and unfiltered reviews\n- Direct interaction between creators and audiences\n- Diverse perspectives from independent reviewers\n- Real-world testing scenarios\n- Community-driven content recommendations\n\nThe success of automotive YouTube channels and streaming content shows that audiences crave genuine, passionate commentary about cars. Whether it's testing a $1,000 budget car or reviewing the latest performance vehicles, authenticity resonates with viewers.\n\nThis evolution has also opened doors for smaller automotive brands and independent creators to reach global audiences.",
                authorId: user[0]!.id,
            },
            {
                thumbnail: "https://picsum.photos/seed/article4/400/250",
                title: "Streaming Technology: How Chromecast Changed Entertainment",
                content: "The introduction of Chromecast fundamentally changed how we consume digital entertainment. By making it simple to cast content from mobile devices to televisions, Google created a bridge between personal and shared viewing experiences.\n\nKey innovations that Chromecast brought:\n- Affordable streaming solution ($35 price point)\n- Universal compatibility across devices\n- Seamless integration with existing apps\n- Minimal setup requirements\n- Support for various content formats\n\nThe technology has enabled new forms of content consumption, from educational videos to entertainment series. It has particularly benefited platforms that create short-form, high-quality content that works well on both mobile and television screens.\n\nThis democratization of streaming technology has empowered content creators to reach audiences in living rooms worldwide, regardless of their production budget or distribution partnerships.",
                authorId: user[1]!.id,
            },
            {
                thumbnail: "https://picsum.photos/seed/article5/400/250",
                title: "Digital Storytelling: The Power of Short Films",
                content: "Short films have experienced a renaissance in the digital age. With platforms providing global distribution and communities supporting independent creators, storytellers can now reach audiences without traditional gatekeepers.\n\nThe medium offers unique advantages:\n- Complete creative control for filmmakers\n- Lower barrier to entry for new creators\n- Experimental storytelling opportunities\n- Direct audience feedback and engagement\n- Portfolio building for career advancement\n\nSuccessful short films often focus on strong character development, compelling narratives, and innovative visual techniques. They serve as testing grounds for new ideas and launching pads for emerging talent.\n\nThe accessibility of high-quality production tools has democratized filmmaking, allowing creators to focus on what matters most: telling compelling stories that resonate with audiences.",
                authorId: user[0]!.id,
            }
        ],
    });

    const videoData = [
        {
            title: "Big Buck Bunny",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
            thumbnail: "https://picsum.photos/seed/bigbuck/400/250",
            authorId: user[0]!.id,
        },
        {
            title: "Elephant Dream",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            description: "The first Blender Open Movie from 2006. A surreal journey through a mechanical world where two characters explore themes of perception and reality.",
            thumbnail: "https://picsum.photos/seed/elephant/400/250",
            authorId: user[1]!.id,
        },
        {
            title: "For Bigger Blazes",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            description: "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV. For when you want to settle into your Iron Throne to watch the latest episodes. For $35.\nLearn how to use Chromecast with HBO GO and more at google.com/chromecast.",
            thumbnail: "https://picsum.photos/seed/blazes/400/250",
            authorId: user[0]!.id,
        },
        {
            title: "For Bigger Escape",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when Batman's escapes aren't quite big enough. For $35. Learn how to use Chromecast with Google Play Movies and more at google.com/chromecast.",
            thumbnail: "https://picsum.photos/seed/escape/400/250",
            authorId: user[1]!.id,
        },
        {
            title: "For Bigger Fun",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV. For $35. Find out more at google.com/chromecast.",
            thumbnail: "https://picsum.photos/seed/fun/400/250",
            authorId: user[0]!.id,
        },
        {
            title: "For Bigger Joyrides",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for the times that call for bigger joyrides. For $35. Learn how to use Chromecast with YouTube and more at google.com/chromecast.",
            thumbnail: "https://picsum.photos/seed/joyrides/400/250",
            authorId: user[1]!.id,
        },
        {
            title: "For Bigger Meltdowns",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when you want to make Buster's big meltdowns even bigger. For $35. Learn how to use Chromecast with Netflix and more at google.com/chromecast.",
            thumbnail: "https://picsum.photos/seed/meltdowns/400/250",
            authorId: user[0]!.id,
        },
        {
            title: "Sintel",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            description: "Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender. With initial funding provided by 1000s of donations via the internet community, it has again proven to be a viable development model for both open 3D technology as for independent animation film.\nThis 15 minute film has been realized in the studio of the Amsterdam Blender Institute, by an international team of artists and developers. In addition to that, several crucial technical and creative targets have been realized online, by developers and artists and teams all over the world.\nwww.sintel.org",
            thumbnail: "https://picsum.photos/seed/sintel/400/250",
            authorId: user[1]!.id,
        },
        {
            title: "Subaru Outback On Street And Dirt",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            description: "Smoking Tire takes the all-new Subaru Outback to the highest point we can find in hopes our customer-appreciation Balloon Launch will get some free T-shirts into the hands of our viewers.",
            thumbnail: "https://picsum.photos/seed/subaru/400/250",
            authorId: user[0]!.id,
        },
        {
            title: "Tears of Steel",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            description: "Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands. The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras. (CC) Blender Foundation - http://www.tearsofsteel.org",
            thumbnail: "https://picsum.photos/seed/tears/400/250",
            authorId: user[1]!.id,
        },
        {
            title: "Volkswagen GTI Review",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            description: "The Smoking Tire heads out to Adams Motorsports Park in Riverside, CA to test the most requested car of 2010, the Volkswagen GTI. Will it beat the Mazdaspeed3's standard-setting lap time? Watch and see...",
            thumbnail: "https://picsum.photos/seed/vw/400/250",
            authorId: user[0]!.id,
        },
        {
            title: "We Are Going On Bullrun",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            description: "The Smoking Tire is going on the 2010 Bullrun Live Rally in a 2011 Shelby GT500, and posting a video from the road every single day! The only place to watch them is by subscribing to The Smoking Tire or watching at BlackMagicShine.com",
            thumbnail: "https://picsum.photos/seed/bullrun/400/250",
            authorId: user[1]!.id,
        },
        {
            title: "What Care Can You Get For A Grand?",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            description: "The Smoking Tire meets up with Chris and Jorge from CarsForAGrand.com to see just how far $1,000 can go when looking for a car. The Smoking Tire meets up with Chris and Jorge from CarsForAGrand.com to see just how far $1,000 can go when looking for a car.",
            thumbnail: "https://picsum.photos/seed/grand/400/250",
            authorId: user[0]!.id,
        }
    ];

    await prisma.video.createMany({
        data: videoData,
    });

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error("Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
