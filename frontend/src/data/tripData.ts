type Tag = {
    text: string;
    color: "orange" | "red" | "green" | "blue" | "purple";
};

export interface GalleryImage {
  url: string;
  label: string;
  significance?: string;
  description?: string;
  dontMiss?: string | string[];
}

export interface LandmarkImage {
  url: string;
  label: string;
  significance?: string;
  description?: string;
  dontMiss?: string | string[];
  category?: string;
  timings?: string;
  duration?: string;
  entryType?: string;
  entryFee?: string;
  gallery?: GalleryImage[];
}


type ItineraryStop = {
    time: string;
    title: string;
    description: string;
    duration: string;
    number?: string;
};

export type CarType = {
    id: string;
    name: string;
    seats: string;
    description: string;
    acPrice: number;
    nonAcPrice: number;
    image: string
};

export type TimeSlot = {
    time: string;
    available: boolean;
    period: "AM" | "PM";
};

export type Supplier = {
    id: string,
    display_name: string,
    legal_name: string,
    address: string,
    phone_number: string
};

export type Hotel = {
    id: string,
    name: string
};

export type Trip = {
    supplier: Supplier,
    hotel: Hotel,
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    taxRate: number,
    duration: string;
    product_type: "sameday" | "city_sightseeing" | "airport_transfer" | "overnight" | "experiences";
    tags: Tag[];
    images: LandmarkImage[];
    itinerary: ItineraryStop[];
    carTypes: CarType[];
    timeSlots: TimeSlot[];
    basePrice?: number;
};

export const tripData: Record<string, Trip> = {
    "8c869966-79b0-4919-b418-33f154f57421": {
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
        title: "Bangalore City Tour in Private Car",
        description: "Discover the rich blend of culture, gardens, temples, colonial architecture, and modern vibrancy that defines Bangalore. This private city tour offers a curated experience ideal for first-time visitors, families, couples or locals entertaining guests.",
        price: 3121,
        basePrice: 3121,
        originalPrice: 3542,
        taxRate: 0.05,
        duration: "9 Hours",
        product_type: "city_sightseeing",
        tags: [
            { text: "Top Pick", color: "orange" as const },
            { text: "Highlights", color: "blue" as const }
        ],
        images: [
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Bangalore%20Palace/Bangalore%20Palace.jpg",
                label: "Bangalore Palace",
                category: "Heritage",
                timings: "10:00 AM – 5:30 PM, Open Daily",
                duration: "60 min",
                entryType: "Ticket Required",
                entryFee: "₹270",
                significance:
                    "Built in 1887 by the Wodeyar dynasty, Bangalore Palace is a stunning example of Tudor Revival architecture and a symbol of royal heritage in Karnataka.",
                description:
                    "The palace features a magnificent blend of Tudor and Scottish Gothic architecture with fortified towers, battlements, and turrets. Inside, visitors can explore elegant wood carvings, royal paintings, vintage furniture, and the grand Durbar Hall with its stained glass ceiling. The sprawling 454-acre gardens surrounding the palace are landscaped with diverse flora and home to roaming peacocks, adding to the royal charm.",
                dontMiss: [
                    "Palace Exterior: Admire the detailed turrets, battlements, and Tudor-style facade.",
                    "Royal Interior: Explore the Durbar Hall, royal paintings, ornate wood carvings, and vintage furniture.",
                    "Vintage Car Collection: See the classic cars owned by the Wodeyar royal family.",
                    "Palace Gardens: Stroll through the landscaped gardens, spot peacocks, and enjoy the rose garden section."
                ],
                gallery: [
                    {
                    url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Bangalore%20Palace/Royal%20Interior.jpeg",
                    label: "Royal Interior"
                    },
                    {
                    url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Bangalore%20Palace/Main%20Floor.jpg",
                    label: "Main Floor"
                    },
                    {
                    url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Bangalore%20Palace/Royal%20Corridor.jpg",
                    label: "Royal Corridor"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Tipu%20Sultan_s%20Summer%20Palace/Palace%20Architecture.jpg",
                label: "Tipu Sultan's Summer Palace & Fort",
                category: "Historical & Heritage Site",
                timings: "8:30 AM – 5:30 PM, Open Daily",
                duration: "60 min",
                entryType: "Ticket Required",
                entryFee: "₹20",
                significance:
                    "Explore the historical grandeur of Tipu Sultan’s era through his summer palace, fort remnants, museum, and adjacent Kote Venkataramana Temple, reflecting Indo-Islamic and Dravidian architecture.",
                description:
                    "Tipu Sultan Fort and Palace is a heritage complex in Bangalore that includes the teakwood Summer Palace, a museum displaying artifacts from Tipu Sultan’s reign, remnants of Bangalore Fort, and the 17th-century Kote Venkataramana Temple. Visitors experience a blend of architectural styles, history, and cultural insights into 18th-century Mysore.",
                dontMiss: [
                    "Summer Palace: Admire the intricate wooden pillars, arches, and frescoes.",
                    "Museum: See Tipu Sultan’s portraits, coins, weapons, and the Tiger of Mysore emblem.",
                    "Fort Remnants: Walk through the original stone ramparts and gateway.",
                    "Kote Venkataramana Temple: Notice the ornate gopuram and finely carved stone pillars."
                ],
                gallery: [
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Tipu%20Sultan_s%20Summer%20Palace/Palace%20Architecture.jpg",
                        label: "Palace Architecture",
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Tipu%20Sultan_s%20Summer%20Palace/Interior%20Chambers.jpg",
                        label: "Interior Chambers",
                    },
                    {
                        url:"https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Tipu%20Sultan_s%20Summer%20Palace/Summer%20Palace.jpg",
                        label: "Summer Palace",
                    },
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/UB%20City/UB%20City%20(Lunch%20Stop).jpg",
                label: "UB City (Lunch Stop)",
                category: "Shopping & Dining",
                timings: "10:00 AM – 10:00 PM, Open Daily",
                duration: "60 min",
                entryType: "Free Entry",
                entryFee: "₹0",
                significance:
                    "Bangalore's premier luxury shopping and business destination, featuring high-end retail, fine dining, offices, and service apartments.",
                description:
                    "UB City is a mixed-use development with luxury retail stores, fine dining restaurants, offices, and service apartments. It's considered the most expensive piece of real estate in Bangalore and perfect for a stylish city break.",
                dontMiss: [
                    "Skybridge: Walk across the skybridge connecting different towers and enjoy panoramic views.",
                    "Luxury Stores: Explore the high-end international and local brand outlets.",
                    "Fine Dining: Try the upscale restaurants and artisanal coffee shops within the complex.",
                    "Rooftop Views: Enjoy cityscape views from the rooftop restaurants and bars."
                ],
                gallery: [
                    {
                    url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/UB%20City/UB%20City.jpg",
                    label: "UB City"
                    },
                    {
                    url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/UB%20City/Luxury%20Complex.webp",
                    label: "Luxury Complex"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Lalbagh%20Botanical%20Garden/Glass%20House.jpg",
                label: "Lalbagh Botanical Garden",
                category: "Nature & Serenity",
                timings: "9:00 AM – 6:00 PM, Open Daily",
                duration: "60 min",
                entryType: "Ticket Required",
                entryFee: "₹25",
                significance: "240-acre botanical garden established in 1760, modeled after Kew Gardens",
                description:"Lalbagh houses India's largest collection of tropical plants and trees. The Glass House, built in 1889, hosts biannual flower shows and is modeled after London's Crystal Palace.",
                dontMiss: [
                    "Glass House: Iconic conservatory hosting biannual flower shows (Jan & Aug)",
                    "Lalbagh Lake: Serene spot for walking and birdwatching",
                    "Botanical Collections: Over 1,000 species of tropical and exotic plants",
                    "Century-old Trees: Including the famous Baobab tree",
                    "Lalbagh Rock: One of the oldest rock formations in the world (~3 billion years old)",
                    "Statues & Monuments: Kempe Gowda Tower and other historical statues",
                    "Walking Trails: Leisurely strolls and jogging paths amidst lush greenery"
                ],
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=Lalbagh%20Botanical%20Garden%20glass%20house%20conservatory%20flowersbotanical%20specimens%20240%20acre%20garden&width=375&height=200&seq=lalbagh2&orientation=landscape",
                        label: "Glass House",
                    },
                    // {
                    //     url: "https://readdy.ai/api/search-image?query=Bull%20Temple%20Bangalore%20large%20Nandi%20statue%20traditional%20architecture%20spiritual%20monument%20Dravidian%20style&width=375&height=200&seq=bull2&orientation=landscape",
                    //     label: "Bull Temple",
                    // },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Lalbagh%20Botanical%20Garden/Lalbagh%20Lake.jpg",
                        label: "Lalbagh Lake",
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Lalbagh%20Botanical%20Garden/Botanical%20Collections.jpg",
                        label: "Botanical Collections",
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Lalbagh%20Botanical%20Garden/Century-old%20Trees.jpg",
                        label: "Century-old Trees",
                    },
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/ISKCON%20Temple/Front%20View.jpg",
                label: "ISKCON Temple",
                category: "Temple / Spiritual Site",
                timings: "7:15 am – 1:00 pm & 4:15 pm – 8:20 pm (Weekday)\n7:15 am – 8:20 pm (Weekend)",
                duration: "120 min",
                entryType: "Free Entry",
                entryFee: "₹0",
                significance: "One of the largest ISKCON temples in the world, opened in 1997, renowned for its serene spiritual atmosphere and contemporary Vaishnava architecture.",
                description: "This modern temple dedicated to Lord Krishna features contemporary architecture with traditional elements. It houses the main Radha Krishna deities, landscaped gardens, meditation spaces, a temple museum, and cultural programs. Visitors can also enjoy prasadam at Govinda’s restaurant within the complex.",
                dontMiss: [
                    "Aarti: Experience the devotional aarti ceremony.",
                    "Temple Deities: See the beautifully decorated Radha Krishna idols.",
                    "Gardens & Meditation: Stroll the landscaped gardens and quiet corners.",
                    "Museum & Exhibits: Explore Krishna exhibits and multimedia shows.",
                    "Govinda’s Restaurant: Try the delicious pure vegetarian prasadam.",
                    "Souvenir Shop: Buy books, incense, and devotional keepsakes."
                ],
                gallery: [
                    // {
                    //     url: "https://readdy.ai/api/search-image?query=ISKCON%20Temple%20Bangalore%20modern%20architecture%20white%20building%20peaceful%20spiritual%20atmosphere%20Krishna%20temple&width=375&height=200&seq=iskcon2&orientation=landscape",
                    //     label: "ISKCON Temple",
                    // },
                    // {
                    //     url: "https://readdy.ai/api/search-image?query=St%20Mary%20Basilica%20Bangalore%20Gothic%20architecture%20oldest%20church%20heritagebuilding%20colonial%20architecture&width=375&height=200&seq=mary2&orientation=landscape",
                    //     label: "St. Mary\"s Basilica",
                    // },
                    { url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/ISKCON%20Temple/Front%20View.jpg", label: "Front View" },
                    { url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/ISKCON%20Temple/Sunset%20View.jpg", label: "Sunset View" },
                    { url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/ISKCON%20Temple/Indoor.jpg", label: "Indoor" }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Visvesvaraya%20Museum/Science%20on%20a%20Sphere.jpg",
                label: "Visvesvaraya Museum",
                category: "Science & Technology Museum",
                timings: "9.30 am – 6 pm, Open Daily",
                duration: "60 min",
                entryType: "Ticket Required",
                entryFee: "₹100",
                significance:
                    "One of India’s premier science museums, showcasing hands-on exhibits and interactive learning for all ages, fostering curiosity in science, technology, and innovation.",
                description:
                    "It is a vibrant hub for science enthusiasts, offering interactive exhibits in mechanics, electronics, space, energy, and life sciences. Designed to engage both children and adults, the museum brings complex concepts to life through hands-on experiences, immersive displays, and educational shows.",
                dontMiss: [
                    "Science on a Sphere: Real-time Earth & weather projections on a giant globe.",
                    "Fun Science Gallery: Hands-on experiments on optics, sound, and motion.",
                    "Space & Aviation: Explore rockets, satellites, aircraft, and planetarium shows.",
                    "Electronics & Communication: Interactive demos on circuits and devices.",
                    "Energy & Environment: Learn renewable energy via solar, wind, and water exhibits.",
                    "Mini Science Park: Outdoor hands-on physics experiments with levers and pulleys."
                ],
                gallery: [
                    { url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Visvesvaraya%20Museum/Science%20on%20a%20Sphere.jpg", label: "Science on a Sphere" },
                    { url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Visvesvaraya%20Museum/Space%20&%20Aviation.jpg", label: "Space & Aviation" },
                    { url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Visvesvaraya%20Museum/Engine%20Hall.jpg", label: "Engine Hall" },
                    { url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Bangalore%20Sightseeing/Visvesvaraya%20Museum/Museum%20Exterior.jpg", label: "Museum Exterior" }
                ]
            }
        ],
        "itinerary": [
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
            "description": "Enjoy a relaxing lunch at a multi-cuisine restaurant offering North, South Indian and international cuisine options.",
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
                acPrice: 3121,
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
                acPrice: 3764,
                nonAcPrice: 4234,
                image: "https://readdy.ai/api/search-image?query=modern%20large%20SUV%20car%20white%20color%20side%20view%20professional%20automotive%20photography%20clean%20white%20background%20premium%20seven%20seater%20SUV%20vehicle&width=80&height=60&seq=large-suv-car&orientation=landscape",
            },
        ],
        timeSlots: [
            // { time: "8:00 AM", available: true, period: "AM" as const },
            { time: "9:00 AM", available: true, period: "AM" as const },
            { time: "10:00 AM", available: true, period: "AM" as const },
            // { time: "11:00 AM", available: true, period: "AM" as const },
            // { time: "12:00 PM", available: true, period: "PM" as const },
            // { time: "1:00 PM", available: true, period: "PM" as const },
            // { time: "2:00 PM", available: true, period: "PM" as const },
            // { time: "3:00 PM", available: true, period: "PM" as const },
        ],
    },
    "a38eba59-6338-4e4d-9fb7-f217309cbdc2": {
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
        title: "Mysore Palace & Gardens - Same Day Round Trip from Bangalore",
        description: "Discover Mysore's royal heritage with palace tours, ancient temples, hilltop sunset views, and the famous musical fountain. A perfect blend of history, culture, and natural beauty in one unforgettable day.",
        price: 5611,
        basePrice: 2834,
        originalPrice: 3542,
        taxRate: 0.05,
        duration: "16 Hours",
        product_type: "sameday",
        tags: [
            { text: "Popular", color: "purple" as const },
            { text: 'Royal Heritage', color: 'green' as const }
        ],
        images: [
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Sri%20Ranganathaswamy%20Temple/Temple.jpg",
                label: "Sri Ranganathaswamy Temple",
                category: "Temple / Spiritual Site",
                timings: "7:00 AM – 1:30 PM & 4:00 PM – 8:00 PM, Open Daily",
                duration: "45 min",
                entryType: "Free Entry",
                entryFee: "₹0 (₹50 Quick Entry)",
                significance:
                    "One of the five sacred Pancharanga Kshetrams on the Kaveri River, this 9th-century temple is a major pilgrimage site for devotees of Lord Vishnu across South India.",
                description:
                    "This ancient temple showcases beautiful Hoysala-Vijayanagara architecture with an impressive gopuram (tower). Located on the historic island of Srirangapatna, the temple offers a peaceful morning atmosphere perfect for prayers and photography. The temple's riverside location adds to its spiritual charm.",
                dontMiss: [
                    "Temple Gopuram: Admire the tall, intricately carved tower.",
                    "Main Shrine: Visit the sanctum with Lord Ranganatha deity.",
                    "Morning Puja: Experience the peaceful worship atmosphere.",
                    "River Views: Enjoy Kaveri River views from temple vicinity."
                ],
                gallery: [
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Sri%20Ranganathaswamy%20Temple/Temple%20Interior.jpeg",
                        label: "Temple Interior"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Sri%20Ranganathaswamy%20Temple/Temple%20Gopuram.jpeg",
                        label: "Temple Gopuram"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Daria%20Daulat%20Bagh/Palace%20Gardens.jpeg",
                label: "Daria Daulat Bagh",
                category: "Heritage / Palace",
                timings: "9:00 AM – 5:00 PM, Open Daily",
                duration: "30 min",
                entryType: "Ticket Required",
                entryFee: "₹20",
                significance:
                    "Built in 1784 by Tipu Sultan, this summer palace showcases Indo-Saracenic architecture and serves as a testament to the Tiger of Mysore's royal heritage and cultural refinement.",
                description:
                    "Known as the 'Garden of the Sea of Wealth', this beautiful palace features stunning wall frescoes depicting Tipu Sultan's military victories, Persian-style paintings, and ornate teak pillars. The palace is surrounded by well-maintained gardens with fountains and flower beds, making it a peaceful retreat.",
                dontMiss: [
                    "Wall Frescoes: See colorful paintings of historic battles.",
                    "Persian Art: Admire the Indo-Persian architectural details.",
                    "Palace Gardens: Walk through the manicured lawns and fountains.",
                    "Museum Artifacts: View Tipu Sultan's personal belongings."
                ],
                gallery: [
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Daria%20Daulat%20Bagh/Palace%20Interior.jpeg",
                        label: "Palace Interior"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Daria%20Daulat%20Bagh/Historic%20Frescoes.jpeg",
                        label: "Historic Frescoes"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Gumbaz-e-Shahi/Gumbaz%20Interior.jpeg",
                label: "Gumbaz-e-Shahi",
                category: "Heritage / Monument",
                timings: "8:00 AM – 6:30 PM, Open Daily",
                duration: "20 min",
                entryType: "Free Entry",
                entryFee: "₹0",
                significance:
                    "This elegant mausoleum built in 1784 houses the tombs of Tipu Sultan, his father Hyder Ali, and his mother, making it an important historical monument of the Mysore kingdom.",
                description:
                    "The Gumbaz features beautiful Persian-style architecture with a distinctive black granite dome, intricate floral decorations, and elegant minarets. The monument is surrounded by peaceful gardens with cypress trees, creating a serene atmosphere for visitors paying respects to the legendary rulers.",
                dontMiss: [
                    "Persian Dome: See the striking black granite dome structure.",
                    "Royal Tombs: View the graves of Tipu Sultan and his family.",
                    "Floral Decorations: Admire the intricate carved patterns.",
                    "Garden Setting: Enjoy the peaceful cypress tree-lined gardens."
                ],
                gallery: [
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Gumbaz-e-Shahi/Interior%20Tombs.jpeg",
                        label: "Interior Tombs"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Gumbaz-e-Shahi/Garden%20Surroundings.jpeg",
                        label: "Garden Surroundings"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Mysuru%20Palace/Evening%20View.jpg",
                label: "Mysuru Palace",
                category: "Heritage / Palace",
                timings: "10:00 AM – 5:30 PM, Open Daily",
                duration: "90 min",
                entryType: "Ticket Required",
                entryFee: "₹120",
                significance:
                    "Built in 1912, Mysore Palace is the crown jewel of Karnataka's heritage. Once the seat of the Wodeyar dynasty, it's one of India's most visited monuments and a masterpiece of Indo-Saracenic architecture.",
                description:
                    "This magnificent palace blends Hindu, Muslim, Rajput, and Gothic architectural styles. Inside, you'll find the stunning Durbar Hall with ornate ceilings, the Kalyana Mantapa with stained glass, the Golden Howdah (royal elephant seat), and the Residential Museum with royal artifacts. The palace is beautifully illuminated on Sundays and holidays.",
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
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Mysuru%20Palace/Palace%20Interior.jpg",
                        label: "Palace Interior"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Mysuru%20Palace/Palace%20Arch.jpg",
                        label: "Palace Arch"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Mysuru%20Palace/Durbar%20Hall.jpg",
                        label: "Durbar Hall"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Mysuru%20Palace/Mysuru%20Palace.jpg",
                        label: "Mysuru Palace"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/GRS%20UpDown/Upside%20Down.jpg",
                label: "GRS UpDown",
                category: "Entertainment",
                timings: "10:30 AM – 7:00 PM, Open Daily",
                duration: "50 min",
                entryType: "Ticket Required",
                entryFee: "₹447",
                significance:
                    "A unique illusion attraction in Mysore where gravity-defying photography meets entertainment. Perfect for families and social media enthusiasts looking for creative, fun experiences.",
                description:
                    "This interactive place features upside-down rooms and anti-gravity illusions where you can capture mind-bending photos. With 6-7 themed rooms including inverted living rooms, giant kitchens, and tilted spaces, the museum offers a fun break from traditional sightseeing. Staff photographers help you get the perfect shot.",
                dontMiss: [
                    "Upside Down Rooms: Pose in gravity-defying scenes.",
                    "Anti-Gravity Room: Create floating illusion photos.",
                    "Giant's Kitchen: Look tiny in oversized room setup.",
                    "Tilted Room: Challenge your balance in tilted space.",
                    "Staff Assistance: Get help with creative photo poses."
                ],
                gallery: [
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/GRS%20UpDown/Upside%20Down%20Room.jpg",
                        label: "Upside Down Room"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/GRS%20UpDown/Anti-Gravity%20Room.png",
                        label: "Anti-Gravity Room"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/GRS%20UpDown/Giant_s%20Kitchen.png",
                        label: "Giant's Kitchen"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/GRS%20UpDown/Inverted.jpg",
                        label: "Inverted"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Sand%20Sculpture%20Museum/Sand%20Sculptures.jpeg",
                label: "Sand Sculpture Museum",
                category: "Art / Museum",
                timings: "8:30 AM – 6:30 PM, Open Daily",
                duration: "30 min",
                entryType: "Ticket Required",
                entryFee: "₹60",
                significance:
                    "South India's only sand sculpture museum showcasing the delicate art of sand carving. A unique cultural experience highlighting Indian heritage through intricate sand artworks.",
                description:
                    "This indoor museum features detailed sand sculptures of Indian gods, historical figures, world monuments, and cultural icons. Each sculpture is carefully crafted and preserved, offering visitors a rare glimpse into this specialized art form. Well-lit displays make it perfect for photography.",
                dontMiss: [
                    "God Sculptures: See detailed sand carvings of Hindu deities.",
                    "Historical Figures: View sculptures of Indian leaders.",
                    "World Monuments: Admire miniature Taj Mahal and others.",
                    "Sculptor's Story: Learn about the art of sand sculpting."
                ],
                gallery: [
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Sand%20Sculpture%20Museum/God%20Sculptures.jpeg",
                        label: "God Sculptures"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Chamundi%20Hills/City%20Panorama%20View.jpg",
                label: "Chamundi Hills",
                category: "Temple / Viewpoint",
                timings: "7:30 AM – 2:00 PM & 3:30 PM – 6:00 PM & 7:30 PM – 9:00 PM, Open Daily",
                duration: "60 min",
                entryType: "Free Entry",
                entryFee: "₹0 (₹30 Quick Entry)",
                significance:
                    "A sacred 12th-century hilltop temple at 1,065 meters, Chamundi Hills offers the best panoramic views of Mysore city and is an important pilgrimage site dedicated to Goddess Chamundeshwari.",
                description:
                    "This hilltop destination combines spirituality with stunning views. The Chamundeshwari Temple sits atop the hill with its tall gopuram visible across the city. Visitors can enjoy breathtaking sunset views of Mysore Palace and the entire city. The famous Nandi Bull statue sits halfway down the hill, carved from a single rock.",
                dontMiss: [
                    "City Viewpoint: Capture panoramic Mysore views at sunset.",
                    "Chamundeshwari Temple: Visit the 12th-century hilltop shrine.",
                    "Sunset Photography: Get golden hour shots of the city.",
                    "Nandi Bull: See the giant monolithic statue."
                ],
                gallery: [
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Chamundi%20Hills/Chamundeshwari%20Temple.jpg",
                        label: "Chamundeshwari Temple"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Chamundi%20Hills/Nandi%20Bull%20Statue.jpg",
                        label: "Nandi Bull Statue"
                    }
                ]
            },
            {
                url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Brindavana%20Gardens/Terraced%20Gardens.jpg",
                label: "Brindavana Gardens",
                category: "Gardens / Entertainment",
                timings: "8:00 AM – 9:00 PM, Open Daily",
                duration: "60 min",
                entryType: "Ticket Required",
                entryFee: "₹100",
                significance:
                    "Built in 1932 below the KRS Dam, these terraced Mughal-style gardens are famous for India's most spectacular musical fountain show, attracting thousands of visitors every evening.",
                description:
                    "These beautifully landscaped gardens feature symmetrical terraces, colorful flower beds, and dancing fountains. The highlight is the evening musical fountain show where synchronized water jets perform to music with colorful LED lights. The KRS Dam backdrop adds to the scenic beauty, making it a perfect end to your Mysore day.",
                dontMiss: [
                    "Musical Fountain Show: Watch the light & music show.",
                    "Terraced Gardens: Stroll through illuminated flower beds.",
                    "KRS Dam View: See the dam lit up in the background.",
                    "Garden Illumination: Enjoy colorful lights after sunset."
                ],
                gallery: [
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Brindavana%20Gardens/KRS%20Dam%20Backdrop.jpeg",
                        label: "KRS Dam Backdrop"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Brindavana%20Gardens/Gardens%20View.jpeg",
                        label: "Gardens View"
                    },
                    {
                        url: "https://nomora-itinerary-images.blr1.digitaloceanspaces.com/Mysore%20Sightseeing/Brindavana%20Gardens/Musical%20Fountain%20Show.jpeg",
                        label: "Musical Fountain Show"
                    }
                ]
            }
        ],
        "itinerary": [
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
                acPrice: 5611,
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
                acPrice: 7519,
                nonAcPrice: 4234,
                image: "https://readdy.ai/api/search-image?query=modern%20large%20SUV%20car%20white%20color%20side%20view%20professional%20automotive%20photography%20clean%20white%20background%20premium%20seven%20seater%20SUV%20vehicle&width=80&height=60&seq=large-suv-car&orientation=landscape",
            },
        ],
        timeSlots: [
            { time: "6:00 AM", available: true, period: "AM" as const },
        ],
    },
};