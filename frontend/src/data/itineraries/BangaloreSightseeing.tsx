import type { Trip } from "../tripData";

export const BangaloreSightseeing: Trip = {
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
    title: 'Bangalore City Tour in Private Car',
    description: 'Discover the rich blend of culture, gardens, temples, colonial architecture, and modern vibrancy that defines Bangalore. This private city tour offers a curated experience ideal for first-time visitors, families, couples or locals entertaining guests.',
    price: 3999,
    originalPrice: 3999,
    taxRate: 0.05,
    duration: "9 Hours",
    product_type: "city_sightseeing",
    tags: [
        { text: 'Top Pick', color: 'orange' as const },
        { text: 'Highlights', color: 'blue' as const }
    ],
    images: [
        {
            url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
            label: 'Lalbagh Botanical Garden',
            category: 'Nature & Serenity',
            timings: '9:00 AM – 6:00 PM, Open Daily',
            duration: '60 min',
            entryType: 'Ticket Required',
            entryFee: '₹25',
            significance: '240-acre botanical garden established in 1760, modeled after Kew Gardens',
            description: 'Lalbagh houses India\'s largest collection of tropical plants and trees. The Glass House, built in 1889, hosts biannual flower shows and is modeled after London\'s Crystal Palace.',
            dontMiss: [
                'Glass House: Iconic conservatory hosting biannual flower shows (Jan & Aug)',
                'Lalbagh Lake: Serene spot for walking and birdwatching',
                'Botanical Collections: Over 1,000 species of tropical and exotic plants',
                'Century-old Trees: Including the famous Baobab tree',
                'Lalbagh Rock: One of the oldest rock formations in the world (~3 billion years old)',
                'Statues & Monuments: Kempe Gowda Tower and other historical statues',
                'Walking Trails: Leisurely strolls and jogging paths amidst lush greenery'
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Bangalore%20Palace%20exterior%20Tudor%20architecture%20with%20beautiful%20royal%20gardens%2C%20heritage%20building%20facade%2C%20detailed%20craftsmanship&width=375&height=200&seq=palace2&orientation=landscape",
                    label: 'Glass House'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Bangalore%20Palace%20interior%20with%20royal%20furniture%20ornate%20decorations%20palace%20rooms%20heritage%20artifacts%20vintage%20furnishings&width=375&height=200&seq=palace3&orientation=landscape",
                    label: 'Lalbagh Lake'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Bangalore%20Palace%20gardens%20with%20peacocks%20royal%20grounds%20landscaped%20gardens%20heritage%20palace%20grounds&width=375&height=200&seq=palace4&orientation=landscape",
                    label: 'Botanical Collections'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Bangalore%20Palace%20gardens%20with%20peacocks%20royal%20grounds%20landscaped%20gardens%20heritage%20palace%20grounds&width=375&height=200&seq=palace4&orientation=landscape",
                    label: 'Century-old Trees'
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Vidhana%20Soudha%20Bangalore%20impressive%20Neo-Dravidian%20government%20architecture%20grand%20building%20facade%20official%20government%20photography&width=375&height=260&seq=vidhana1&orientation=landscape",
            label: 'Tipu Sultan\'s Summer Palace & Fort',
            category: 'Historical & Heritage Site',
            timings: '8:30 AM – 5:30 PM, Open Daily',
            duration: '60 min',
            entryType: 'Ticket Required',
            entryFee: '₹20',
            significance: 'Explore the historical grandeur of Tipu Sultan’s era through his summer palace, fort remnants, museum, and adjacent Kote Venkataramana Temple, reflecting Indo-Islamic and Dravidian architecture.',
            description: 'Tipu Sultan Fort and Palace is a heritage complex in Bangalore that includes the teakwood Summer Palace, a museum displaying artifacts from Tipu Sultan’s reign, remnants of Bangalore Fort, and the 17th-century Kote Venkataramana Temple. Visitors experience a blend of architectural styles, history, and cultural insights into 18th-century Mysore.',
            dontMiss: [
                'Summer Palace: Admire the intricate wooden pillars, arches, and frescoes.',
                'Museum: See Tipu Sultan’s portraits, coins, weapons, and the Tiger of Mysore emblem.',
                'Fort Remnants: Walk through the original stone ramparts and gateway.',
                'Kote Venkataramana Temple: Notice the ornate gopuram and finely carved stone pillars.'
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Vidhana%20Soudha%20daytime%20with%20Neo-Dravidian%20architecture%20government%20building%20impressive%20facade%20official%20photography&width=375&height=200&seq=vidhana2&orientation=landscape",
                    label: 'Summer Palace'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Vidhana%20Soudha%20daytime%20with%20Neo-Dravidian%20architecture%20government%20building%20impressive%20facade%20official%20photography&width=375&height=200&seq=vidhana2&orientation=landscape",
                    label: 'Palace Architecture'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Vidhana%20Soudha%20daytime%20with%20Neo-Dravidian%20architecture%20government%20building%20impressive%20facade%20official%20photography&width=375&height=200&seq=vidhana2&orientation=landscape",
                    label: 'Interior Chambers'
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Cubbon%20Park%20Bangalore%20green%20trees%20walking%20paths%20peaceful%20garden%20landscape%20300%20acre%20urban%20park%20nature&width=375&height=260&seq=cubbon1&orientation=landscape",
            label: 'Visvesvaraya Museum',
            category: 'Science & Technology Museum',
            timings: '9.30 am – 6 pm, Open Daily',
            duration: '60 min',
            entryType: 'Ticket Required',
            entryFee: '₹100',
            significance: 'One of India’s premier science museums, showcasing hands-on exhibits and interactive learning for all ages, fostering curiosity in science, technology, and innovation.',
            description: 'It is a vibrant hub for science enthusiasts, offering interactive exhibits in mechanics, electronics, space, energy, and life sciences. Designed to engage both children and adults, the museum brings complex concepts to life through hands-on experiences, immersive displays, and educational shows',
            dontMiss: [
                'Science on a Sphere: Real-time Earth & weather projections on a giant globe.',
                'Fun Science Gallery: Hands-on experiments on optics, sound, and motion.',
                'Space & Aviation: Explore rockets, satellites, aircraft, and planetarium shows.',
                'Electronics & Communication: Interactive demos on circuits and devices.',
                'Energy & Environment: Learn renewable energy via solar, wind, and water exhibits.',
                'Mini Science Park: Outdoor hands-on physics experiments with levers and pulleys.'
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20interior%20wooden%20architecture%20Islamic%20designs%20palace%20chambers%20historical%20artifacts&width=375&height=200&seq=tipu3&orientation=landscape",
                    label: 'Science on a Sphere'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20interior%20wooden%20architecture%20Islamic%20designs%20palace%20chambers%20historical%20artifacts&width=375&height=200&seq=tipu3&orientation=landscape",
                    label: 'Space & Aviation'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20interior%20wooden%20architecture%20Islamic%20designs%20palace%20chambers%20historical%20artifacts&width=375&height=200&seq=tipu3&orientation=landscape",
                    label: 'Engine Hall'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20interior%20wooden%20architecture%20Islamic%20designs%20palace%20chambers%20historical%20artifacts&width=375&height=200&seq=tipu3&orientation=landscape",
                    label: 'Museum Exterior'
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20Indo-Islamic%20architecture%20wooden%20pillars%20heritage%20monument%20historical%20building&width=375&height=260&seq=tipu1&orientation=landscape",
            label: 'UB City (Lunch Stop)',
            category: 'Shopping & Meals',
            timings: '10:00 AM – 10:00 PM, Open Daily',
            duration: '60 min',
            entryType: 'Free Entry',
            entryFee: '₹0',
            significance: "Bangalore's premier luxury shopping and business destination, featuring high-end retail, fine dining, offices, and service apartments.",
            description: "UB City is a mixed-use development with luxury retail stores, fine dining restaurants, offices, and service apartments. It's considered the most expensive piece of real estate in Bangalore and perfect for a stylish city break.",
            dontMiss: [
                "Skybridge: Walk across the skybridge connecting different towers and enjoy panoramic views.",
                "Luxury Stores: Explore the high-end international and local brand outlets.",
                "Fine Dining: Try the upscale restaurants and artisanal coffee shops within the complex.",
                "Rooftop Views: Enjoy cityscape views from the rooftop restaurants and bars."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20exterior%20Indo-Islamic%20architecture%20wooden%20structure%20historical%20monument%20heritage%20building&width=375&height=200&seq=tipu2&orientation=landscape",
                    label: 'UB City'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20exterior%20Indo-Islamic%20architecture%20wooden%20structure%20historical%20monument%20heritage%20building&width=375&height=200&seq=tipu2&orientation=landscape",
                    label: 'Luxury Complex'
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=UB%20City%20Mall%20Bangalore%20modern%20luxury%20architecture%20upscale%20shopping%20complex%20high-end%20retail%20center&width=375&height=260&seq=ub1&orientation=landscape",
            label: "Bangalore Palace",
            category: "Heritage",
            timings: "10:00 AM – 5:30 PM, Open Daily",
            duration: "60 min",
            entryType: "Ticket Required",
            entryFee: "₹270",
            significance: "Built in 1887 by the Wodeyar dynasty, Bangalore Palace is a stunning example of Tudor Revival architecture and a symbol of royal heritage in Karnataka.",
            description: "The palace features a magnificent blend of Tudor and Scottish Gothic architecture with fortified towers, battlements, and turrets. Inside, visitors can explore elegant wood carvings, royal paintings, vintage furniture, and the grand Durbar Hall with its stained glass ceiling. The sprawling 454-acre gardens surrounding the palace are landscaped with diverse flora and home to roaming peacocks, adding to the royal charm.",
            dontMiss: [
                "Palace Exterior: Admire the detailed turrets, battlements, and Tudor-style facade.",
                "Royal Interior: Explore the Durbar Hall, royal paintings, ornate wood carvings, and vintage furniture.",
                "Vintage Car Collection: See the classic cars owned by the Wodeyar royal family.",
                "Palace Gardens: Stroll through the landscaped gardens, spot peacocks, and enjoy the rose garden section."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=UB%20City%20mallexterior%20modern%20luxury%20architecture%20Bangalore%20upscale%20shopping%20complex%20contemporary%20design&width=375&height=200&seq=ub2&orientation=landscape",
                    label: "Royal Interior"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=UB%20City%20mallexterior%20modern%20luxury%20architecture%20Bangalore%20upscale%20shopping%20complex%20contemporary%20design&width=375&height=200&seq=ub2&orientation=landscape",
                    label: "Main Floor"
                },
                {
                    url: "https://readdy.ai/api/search-image?query=UB%20City%20mallexterior%20modern%20luxury%20architecture%20Bangalore%20upscale%20shopping%20complex%20contemporary%20design&width=375&height=200&seq=ub2&orientation=landscape",
                    label: "Royal Corridor"
                }
            ]
        },
        {
            url: "https://readdy.ai/api/search-image?query=ISKCON%20Temple%20Bangalore%20beautiful%20white%20architecture%20peaceful%20atmosphere%20modern%20temple%20complex%20spiritual%20center&width=375&height=260&seq=iskcon1&orientation=landscape",
            label: 'ISKCON Temple',
            category: 'Temple / Spiritual Site',
            timings: '7:15 am – 1:00 pm & 4:15 pm – 8:20 pm (Weekday)\n7:15 am – 8:20 pm (Weekend)',
            duration: '120 min',
            entryType: 'Free Entry',
            entryFee: '₹0',
            significance: 'One of the largest ISKCON temples in the world, opened in 1997, renowned for its serene spiritual atmosphere and contemporary Vaishnava architecture.',
            description: 'This modern temple dedicated to Lord Krishna features contemporary architecture with traditional elements. It houses the main Radha Krishna deities, landscaped gardens, meditation spaces, a temple museum, and cultural programs. Visitors can also enjoy prasadam at Govinda’s restaurant within the complex.',
            dontMiss: [
                "Aarti: Experience the devotional aarti ceremony.",
                "Temple Deities: See the beautifully decorated Radha Krishna idols.",
                "Gardens & Meditation: Stroll the landscaped gardens and quiet corners.",
                "Museum & Exhibits: Explore Krishna exhibits and multimedia shows.",
                "Govinda’s Restaurant: Try the delicious pure vegetarian prasadam.",
                "Souvenir Shop: Buy books, incense, and devotional keepsakes."
            ],
            gallery: [
                {
                    url: "https://readdy.ai/api/search-image?query=MG%20Road%20Bangalore%20shopping%20areas%20urban%20lifestyle%20central%20business%20district%20modern%20commercial%20area&width=375&height=200&seq=mg2&orientation=landscape",
                    label: 'Front View'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=MG%20Road%20Bangalore%20shopping%20areas%20urban%20lifestyle%20central%20business%20district%20modern%20commercial%20area&width=375&height=200&seq=mg2&orientation=landscape",
                    label: 'Sunset View'
                },
                {
                    url: "https://readdy.ai/api/search-image?query=MG%20Road%20Bangalore%20shopping%20areas%20urban%20lifestyle%20central%20business%20district%20modern%20commercial%20area&width=375&height=200&seq=mg2&orientation=landscape",
                    label: 'Indoor'
                }
            ]
        },
    ],
    itinerary: [
        {
            "time": "9:00 AM",
            "title": "Hotel Pickup",
            "description": "Begin your city tour with a comfortable pickup from your accommodation in a private vehicle.",
            "duration": ""
        },
        {
            "time": "9:15 AM",
            "number": "1",
            "title": "Lalbagh Botanical Garden",
            "description": "Stroll through 240 acres of lush gardens, exotic flora, and a historic glasshouse, perfect for morning photography and fresh air.",
            "duration": "60 min"
        },
        {
            "time": "10:30 AM",
            "number": "2",
            "title": "Tipu Sultan's Summer Palace",
            "description": "Explore 18th-century teakwood palace and nearby fort ruins showcasing Tipu Sultan’s royal heritage and Indo-Islamic architecture.",
            "duration": "60 min"
        },
        {
            "time": "11:45 AM",
            "number": "3",
            "title": "Visvesvaraya Museum",
            "description": "Engage with interactive exhibits and learn about India’s engineering marvels in this educational and entertaining museum.",
            "duration": "60 min"
        },
        {
            "time": "1:00 PM",
            "number": "4",
            "title": "UB City (Lunch Stop)",
            "description": "Enjoy a relaxing lunch at a local restaurant offering North, South Indian and international cuisine options.",
            "duration": "60 min"
        },
        {
            "time": "2:15 PM",
            "number": "5",
            "title": "Bangalore Palace",
            "description": "Admire Tudor-style architecture, ornate interiors, vintage collections, and royal gardens of the Wodeyar dynasty.",
            "duration": "60 min"
        },
        {
            "time": "3:30 PM",
            "number": "6",
            "title": "ISKCON Temple",
            "description": "Visit one of Bangalore’s grandest temples, enjoy serene spiritual ambiance, and participate in evening aarti.",
            "duration": "120 min"
        },
        {
            "time": "6:00 PM",
            "title": "Return to Hotel",
            "description": "Conclude your day tour and return to your accommodation, reflecting on a full day of cultural and historical experiences.",
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
        { time: "8:00 AM", available: true, period: "AM" as const },
        { time: "9:00 AM", available: true, period: "AM" as const },
        { time: "10:00 AM", available: true, period: "AM" as const },
        { time: "11:00 AM", available: true, period: "AM" as const },
        { time: "12:00 PM", available: true, period: "PM" as const },
        { time: "1:00 PM", available: true, period: "PM" as const },
        { time: "2:00 PM", available: true, period: "PM" as const },
        { time: "3:00 PM", available: true, period: "PM" as const },
    ],
}