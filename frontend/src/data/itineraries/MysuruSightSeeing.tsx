import type { Trip } from "../tripData";

export const MysuruSightseeing: Trip = {
    supplier: {
        id: '2ab0348d-13d9-45cc-b14b-12b46fb2f8a4',
        display_name: "Shanti Travels",
        legal_name: "Mukesh Kumar",
        address: "13th Lane Road",
        phone_number: "9163161834"
    },
    hotel: {
        id: '0b1ac40f-c47d-4eda-bf7b-0cfb203288c4',
        name: "HSR Layout",
    },
    title: 'Mysore Palace & Gardens - Same Day Round Trip from Bangalore',
    description: 'Discover Mysore\'s royal heritage with palace tours, ancient temples, hilltop sunset views, and the famous musical fountain. A perfect blend of history, culture, and natural beauty in one unforgettable day.',
    price: 5999,
    originalPrice: 5999,
    taxRate: 0.05,
    duration: '16 Hours',
    product_type: "city_sightseeing",
    tags: [
        { text: 'Popular', color: 'purple' as const },
        { text: 'Royal Heritage', color: 'green' as const }
    ],
    images:[
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: "Sri Ranganathaswamy Temple",
            category: "Temple / Spiritual Site",
            timings: "7:00 AM – 1:30 PM & 4:00 PM – 8:00 PM, Open Daily",
            duration: "45 min",
            entryType: "Free Entry",
            entryFee: "₹0 (₹50 Quick Entry)",
            significance: "One of the five sacred Pancharanga Kshetrams on the Kaveri River, this 9th-century temple is a major pilgrimage site for devotees of Lord Vishnu across South India.",
            description: "This ancient temple showcases beautiful Hoysala-Vijayanagara architecture with an impressive gopuram (tower). Located on the historic island of Srirangapatna, the temple offers a peaceful morning atmosphere perfect for prayers and photography. The temple's riverside location adds to its spiritual charm.",
            dontMiss: [
                "Temple Gopuram: Admire the tall, intricately carved tower.",
                "Main Shrine: Visit the sanctum with Lord Ranganatha deity.",
                "Morning Puja: Experience the peaceful worship atmosphere.",
                "River Views: Enjoy Kaveri River views from temple vicinity."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Temple Interior"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Ranganathaswamy%20Temple%20interior%20sanctum%20Vishnu%20deity%20worship%20hall%20devotees%20prayer%20atmosphere&width=375&height=200&seq=temple3&orientation=landscape",
                    label: "Temple Gopuram"
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: "Daria Daulat Bagh",
            category: "Heritage / Palace",
            timings: "9:00 AM – 5:00 PM, Open Daily",
            duration: "30 min",
            entryType: "Ticket Required",
            entryFee: "₹20",
            significance: "Built in 1784 by Tipu Sultan, this summer palace showcases Indo-Saracenic architecture and serves as a testament to the Tiger of Mysore's royal heritage and cultural refinement.",
            description: "Known as the 'Garden of the Sea of Wealth', this beautiful palace features stunning wall frescoes depicting Tipu Sultan's military victories, Persian-style paintings, and ornate teak pillars. The palace is surrounded by well-maintained gardens with fountains and flower beds, making it a peaceful retreat.",
            dontMiss: [
                "Wall Frescoes: See colorful paintings of historic battles.",
                "Persian Art: Admire the Indo-Persian architectural details.",
                "Palace Gardens: Walk through the manicured lawns and fountains.",
                "Museum Artifacts: View Tipu Sultan's personal belongings."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Palace Interior"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Historic Frescoes"
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: "Gumbaz-e-Shahi",
            category: "Heritage / Monument",
            timings: "8:00 AM – 6:30 PM, Open Daily",
            duration: "20 min",
            entryType: "Free Entry",
            entryFee: "₹0",
            significance: "This elegant mausoleum built in 1784 houses the tombs of Tipu Sultan, his father Hyder Ali, and his mother, making it an important historical monument of the Mysore kingdom.",
            description: "The Gumbaz features beautiful Persian-style architecture with a distinctive black granite dome, intricate floral decorations, and elegant minarets. The monument is surrounded by peaceful gardens with cypress trees, creating a serene atmosphere for visitors paying respects to the legendary rulers.",
            dontMiss: [
                "Persian Dome: See the striking black granite dome structure.",
                "Royal Tombs: View the graves of Tipu Sultan and his family.",
                "Floral Decorations: Admire the intricate carved patterns.",
                "Garden Setting: Enjoy the peaceful cypress tree-lined gardens."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Interior Tombs"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Garden Surroundings"
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: "Mysuru Palace",
            category: "Heritage / Palace",
            timings: "10:00 AM – 5:30 PM, Open Daily",
            duration: "90 min",
            entryType: "Ticket Required",
            entryFee: "₹120",
            significance: "Built in 1912, Mysore Palace is the crown jewel of Karnataka's heritage. Once the seat of the Wodeyar dynasty, it's one of India's most visited monuments and a masterpiece of Indo-Saracenic architecture.",
            description: "This magnificent palace blends Hindu, Muslim, Rajput, and Gothic architectural styles. Inside, you'll find the stunning Durbar Hall with ornate ceilings, the Kalyana Mantapa with stained glass, the Golden Howdah (royal elephant seat), and the Residential Museum with royal artifacts. The palace is beautifully illuminated on Sundays and holidays.",
            dontMiss: [
                "Durbar Hall: Marvel at the ornate ceiling and royal throne.",
                "Kalyana Mantapa: See the stunning stained glass ceiling.",
                "Golden Howdah: View the royal elephant seat with gold.",
                "Royal Paintings: Explore portraits of Wodeyar kings.",
                "Residential Museum: See vintage furniture and royal items.",
                "Palace Exterior: Photograph the grand Indo-Saracenic facade."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Palace Interior"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Palace Arch"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Durbar Hall"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Mysuru Palace"
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: "GRS UpDown",
            category: "Entertainment",
            timings: "10:30 AM – 7:00 PM, Open Daily",
            duration: "50 min",
            entryType: "Ticket Required",
            entryFee: "₹447",
            significance: "A unique illusion attraction in Mysore where gravity-defying photography meets entertainment. Perfect for families and social media enthusiasts looking for creative, fun experiences.",
            description: "This interactive place features upside-down rooms and anti-gravity illusions where you can capture mind-bending photos. With 6-7 themed rooms including inverted living rooms, giant kitchens, and tilted spaces, the museum offers a fun break from traditional sightseeing. Staff photographers help you get the perfect shot.",
            dontMiss: [
                "Upside Down Rooms: Pose in gravity-defying scenes.",
                "Anti-Gravity Room: Create floating illusion photos.",
                "Giant's Kitchen: Look tiny in oversized room setup.",
                "Tilted Room: Challenge your balance in tilted space.",
                "Staff Assistance: Get help with creative photo poses."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Upside Down Room"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Anti-Gravity Room"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Giant's Kitchen"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Inverted"
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: "Sand Sculpture Museum",
            category: "Art / Museum",
            timings: "8:30 AM – 6:30 PM, Open Daily",
            duration: "30 min",
            entryType: "Ticket Required",
            entryFee: "₹60",
            significance: "South India's only sand sculpture museum showcasing the delicate art of sand carving. A unique cultural experience highlighting Indian heritage through intricate sand artworks.",
            description: "This indoor museum features detailed sand sculptures of Indian gods, historical figures, world monuments, and cultural icons. Each sculpture is carefully crafted and preserved, offering visitors a rare glimpse into this specialized art form. Well-lit displays make it perfect for photography.",
            dontMiss: [
                "God Sculptures: See detailed sand carvings of Hindu deities.",
                "Historical Figures: View sculptures of Indian leaders.",
                "World Monuments: Admire miniature Taj Mahal and others.",
                "Sculptor's Story: Learn about the art of sand sculpting."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "God Sculptures"
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: "Chamundi Hills",
            category: "Temple / Viewpoint",
            timings: "7:30 AM – 2:00 PM & 3:30 PM – 6:00 PM & 7:30 PM – 9:00 PM, Open Daily",
            duration: "60 min",
            entryType: "Free Entry",
            entryFee: "₹0 (₹30 Quick Entry)",
            significance: "A sacred 12th-century hilltop temple at 1,065 meters, Chamundi Hills offers the best panoramic views of Mysore city and is an important pilgrimage site dedicated to Goddess Chamundeshwari.",
            description: "This hilltop destination combines spirituality with stunning views. The Chamundeshwari Temple sits atop the hill with its tall gopuram visible across the city. Visitors can enjoy breathtaking sunset views of Mysore Palace and the entire city. The famous Nandi Bull statue sits halfway down the hill, carved from a single rock.",
            dontMiss: [
                "City Viewpoint: Capture panoramic Mysore views at sunset.",
                "Chamundeshwari Temple: Visit the 12th-century hilltop shrine.",
                "Sunset Photography: Get golden hour shots of the city.",
                "Nandi Bull: See the giant monolithic statue."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Chamundeshwari Temple"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Nandi Bull Statue"
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: "Brindavana Gardens",
            category: "Gardens / Entertainment",
            timings: "8:00 AM – 9:00 PM, Open Daily",
            duration: "60 min",
            entryType: "Ticket Required",
            entryFee: "₹100",
            significance: "Built in 1932 below the KRS Dam, these terraced Mughal-style gardens are famous for India's most spectacular musical fountain show, attracting thousands of visitors every evening.",
            description: "These beautifully landscaped gardens feature symmetrical terraces, colorful flower beds, and dancing fountains. The highlight is the evening musical fountain show where synchronized water jets perform to music with colorful LED lights. The KRS Dam backdrop adds to the scenic beauty, making it a perfect end to your Mysore day.",
            dontMiss: [
                "Musical Fountain Show: Watch the light & music show.",
                "Terraced Gardens: Stroll through illuminated flower beds.",
                "KRS Dam View: See the dam lit up in the background.",
                "Garden Illumination: Enjoy colorful lights after sunset."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "KRS Dam Backdrop"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Gardens View"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                    label: "Musical Fountain Show"
                },
            ]
        }
    ],
    itinerary: [
        {
            "time": "6:00 AM",
            "title": "Hotel Departure",
            "description": "Begin your Mysore adventure with an early departure. Start fresh to maximize your day and beat traffic on the highway.",
            "duration": ""
        },
        {
            "time": "7:15 AM",
            "number": "1",
            "title": "Breakfast",
            "description": "Stop at a highway restaurant for a quick South Indian breakfast. Must-try: Maddur vada (local specialty), idli-vada combo, and filter coffee. Restroom break included.",
            "duration": "30 min"
        },
        {
            "time": "8:30 AM",
            "number": "2",
            "title": "Sri Ranganathaswamy Temple",
            "description": "Visit one of the five sacred Pancharanga Kshetrams dedicated to Lord Vishnu. Marvel at 9th-century Hoysala-Vijayanagara architecture with its impressive gopuram. Experience peaceful morning puja atmosphere.",
            "duration": "45 min"
        },
        {
            "time": "9:30 AM",
            "number": "3",
            "title": "Daria Daulat Bagh",
            "description": "Explore Tipu Sultan's stunning summer palace (1784) featuring Indo-Saracenic architecture, intricate wall frescoes depicting historical battles, Persian-style paintings, and beautifully manicured gardens.",
            "duration": "30 min"
        },
        {
            "time": "10:00 AM",
            "number": "4",
            "title": "Gumbaz-e-Shahi",
            "description": "Pay respects at the elegant mausoleum of Tipu Sultan and his parents. Admire the Persian architectural style with its distinctive dome, minarets, and peaceful garden setting.",
            "duration": "20 min"
        },
        {
            "time": "11:00 AM",
            "number": "5",
            "title": "Mysuru Palace",
            "description": "Experience the crown jewel of Mysore - a magnificent Indo-Saracenic architectural masterpiece. Explore the ornate Durbar Hall, Kalyana Mantapa with stained glass ceiling, Golden Howdah, and Residential Museum.",
            "duration": "90 min"
        },
        {
            "time": "12:30 PM",
            "number": "6",
            "title": "Lunch Break",
            "description": "Enjoy a relaxing lunch at a local restaurant offering North, South Indian and international cuisine options.",
            "duration": "60 min"
        },
        {
            "time": "2:00 PM",
            "number": "7",
            "title": "GRS UpDown",
            "description": "Take a fun break at this unique upside-down illusion museum. Capture mind-bending photos in 6-7 themed rooms with anti-gravity effects. Perfect air-conditioned respite during the afternoon heat.",
            "duration": "45 min"
        },
        {
            "time": "3:15 PM",
            "number": "8",
            "title": "Mysore Sand Sculpture Museum",
            "description": "Visit South India's only sand sculpture museum featuring intricate sculptures of gods, historical figures, and world monuments. Well-lit indoor space perfect for afternoon photography.",
            "duration": "30 min"
        },
        {
            "time": "4:00 PM",
            "number": "9",
            "title": "Chamundi Hills",
            "description": "Ascend to 1,065 meters for breathtaking panoramic views of Mysore city and palace. Visit the 12th-century Chamundeshwari Temple and capture stunning golden hour sunset photography from the viewpoint.",
            "duration": "60 min"
        },
        {
            "time": "6:00 PM",
            "number": "10",
            "title": "Brindavana Gardens",
            "description": "Experience the spectacular musical fountain show (7:00-7:45 PM) with synchronized water jets, colorful LED lights, and music. Stroll through beautifully illuminated terraced Mughal-style gardens with KRS Dam as backdrop.",
            "duration": "60 min"
        },
         {
            "time": "7:00 PM",
            "title": "Return Journey to Bangalore",
            "description": "Begin your comfortable night drive back to Bangalore on the well-lit NH275 highway with lighter traffic. Arrive refreshed with memories of a complete Mysore experience.",
            "duration": "3 hr"
        },
        {
            "time": "8:00 PM",
            "number": "11",
            "title": "Dinner at a Restaurant",
            "description": "Enjoy a relaxed dinner at this highway restaurant offering multi-cuisine options. Conveniently located on your return route to Bangalore. Last restroom break before the journey home.",
            "duration": "30 min"
        },
        {
            "time": "10:30 PM",
            "title": "Hotel Arrival",
            "description": "Arrive back at your hotel, concluding your comprehensive one-day Mysore heritage and cultural tour.",
            "duration": ""
        }
    ],
    carTypes: [
        // {
        //     id: "mini",
        //     name: "Go",
        //     seats: "3+1 Seats",
        //     description: "WagonR, Santro, Indica",
        //     acPrice: 2834,
        //     nonAcPrice: 2534,
        //     image: "https://static.readdy.ai/image/638a2981e869109b2bf5c39446e6f624/a0d6c1b50962cd0444cc6c35e689976a.png",
        // },
        {
            id: "sedan",
            name: "Prime",
            seats: "4+1 Seats",
            description: "Dzire, Etios, Xcent",
            acPrice: 3134,
            nonAcPrice: 2834,
            image: "https://readdy.ai/api/search-image?query=modern%20sedan%20car%20white%20color%20side%20view%20professional%20automotive%20photography%20clean%20white%20background%20mid-size%20family%20sedan%20vehicle&width=80&height=60&seq=sedan-car&orientation=landscape",
        },
        // {
        //     id: "suv",
        //     name: "Edge",
        //     seats: "4+1 Seats",
        //     description: "Creta, Seltos",
        //     acPrice: 3834,
        //     nonAcPrice: 3534,
        //     image: "https://readdy.ai/api/search-image?query=modern%20SUV%20car%20white%20color%20side%20view%20professional%20automotive%20photography%20clean%20white%20background%20compact%20SUV%20crossover%20vehicle&width=80&height=60&seq=suv-car&orientation=landscape",
        // },
        {
            id: "suv+",
            name: "Max",
            seats: "6+1 Seats",
            description: "Ertiga, Innova, Marazzo",
            acPrice: 4534,
            nonAcPrice: 4234,
            image: "https://readdy.ai/api/search-image?query=modern%20large%20SUV%20car%20white%20color%20side%20view%20professional%20automotive%20photography%20clean%20white%20background%20premium%20seven%20seater%20SUV%20vehicle&width=80&height=60&seq=large-suv-car&orientation=landscape",
        },
    ],
    timeSlots: [
        { time: "6:00 AM", available: true, period: "AM" as const }
    ],
}