type Tag = {
    text: string;
    color: "orange" | "red" | "green" | "purple";
};

type GalleryImage = {
    url: string;
    label: string;
    significance: string;
    description: string;
    dontMiss: string;
};

type LandmarkImage = {
    url: string;
    label: string;
    category: string;
    timings: string;
    duration: string;
    entryType: string;
    entryFee: string;
    gallery: GalleryImage[];
};

type ItineraryStop = {
    time: string;
    title: string;
    description: string;
    duration: string;
    number?: string;
};

type CarType = {
    id: string;
    name: string;
    seats: string;
    description: string;
    acPrice: number;
    nonAcPrice: number;
    image: string
};

type TimeSlot = {
    time: string;
    available: boolean;
    period: "AM" | "PM";
};

type Supplier = {
    id: string,
    display_name: string,
    legal_name: string,
    address: string,
    phone_number: string
};

type Hotel = {
    id: string,
    name: string
};

type Trip = {
    supplier: Supplier,
    hotel: Hotel,
    title: string;
    description: string;
    price: number;
    basePrice: number;
    originalPrice: number;
    taxRate: number,
    duration: string;
    product_type: "sameday" | "city_sightseeing" | "airport_transfer" | "overnight" | "experiences";
    tags: Tag[];
    images: LandmarkImage[];
    itinerary: ItineraryStop[];
    carTypes: CarType[];
    timeSlots: TimeSlot[];
};

export const tripData: Record<string, Trip> = {
    "heritage-tour-8hr": {
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
        title: "Full Day Bangalore City Tour in Private Car",
        description: "Discover the rich blend of culture, gardens, temples, colonial architecture, and modern vibrancy that defines Bangalore. This full-day private city tour offers a curated experience perfect for first-time visitors or locals entertaining guests.",
        price: 2834,
        basePrice: 2834,
        originalPrice: 3542,
        taxRate: 0.05,
        duration: "8 Hours",
        product_type: "city_sightseeing",
        tags: [
            { text: "Highlights", color: "orange" as const },
            { text: "Top Pick", color: "red" as const }
        ],
        images: [
            {
                url: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Bangalore%20Palace%20with%20Tudor-style%20architecture%2C%20ornate%20details%20and%20royal%20gardens%2C%20golden%20sunlight%2C%20majestic%20palace%20photography%2C%20heritage%20building&width=375&height=260&seq=palace1&orientation=landscape",
                label: "Bangalore Palace",
                category: "Heritage",
                timings: "Mon–Wed 10AM–5PM, Thu Closed, Fri–Sun 10AM–6PM",
                duration: "45-60 mins",
                entryType: "Ticket Required",
                entryFee: "₹230-280",
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=Bangalore%20Palace%20exterior%20Tudor%20architecture%20with%20beautiful%20royal%20gardens%2C%20heritage%20building%20facade%2C%20detailed%20craftsmanship&width=375&height=200&seq=palace2&orientation=landscape",
                        label: "Palace Exterior",
                        significance: "Built in 1887 by the Wodeyar dynasty, showcasing Tudor Revival architecture",
                        description: "The palace displays a stunning blend of Tudor and Scottish Gothic architecture with fortified towers, battlements, and turrets. The exterior features beautiful woodwork and is surrounded by sprawling gardens.",
                        dontMiss: "The vintage car collection and the beautiful gardens with peacocks roaming freely"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=Bangalore%20Palace%20interior%20with%20royal%20furniture%20ornate%20decorations%20palace%20rooms%20heritage%20artifacts%20vintage%20furnishings&width=375&height=200&seq=palace3&orientation=landscape",
                        label: "Royal Interior",
                        significance: "Houses priceless artifacts, paintings, and furniture from the royal era",
                        description: "The interiors feature elegant wood carvings, paintings, furniture, and decor that reflect the lifestyle of the Mysore royal family. The Durbar Hall is particularly magnificent with its stained glass ceiling.",
                        dontMiss: "The Durbar Hall with its colorful stained glass ceiling and the collection of hunting trophies"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=Bangalore%20Palace%20gardens%20with%20peacocks%20royal%20grounds%20landscaped%20gardens%20heritage%20palace%20grounds&width=375&height=200&seq=palace4&orientation=landscape",
                        label: "Palace Gardens",
                        significance: "Sprawling 454-acre estate with landscaped gardens and wildlife",
                        description: "The palace is set amidst 454 acres of beautifully landscaped gardens featuring various species of flora. The grounds are home to peacocks and other birds, creating a serene royal atmosphere.",
                        dontMiss: "Spotting peacocks in their natural habitat and the rose garden section"
                    }
                ]
            },
            {
                url: "https://readdy.ai/api/search-image?query=Vidhana%20Soudha%20Bangalore%20impressive%20Neo-Dravidian%20government%20architecture%20grand%20building%20facade%20official%20government%20photography&width=375&height=260&seq=vidhana1&orientation=landscape",
                label: "Vidhana Soudha",
                category: "Government Architecture",
                timings: "Mon–Fri 9AM–6PM (External viewing only)",
                duration: "20-30 mins",
                entryType: "Free Viewing",
                entryFee: "Free",
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=Vidhana%20Soudha%20daytime%20with%20Neo-Dravidian%20architecture%20government%20building%20impressive%20facade%20official%20photography&width=375&height=200&seq=vidhana2&orientation=landscape",
                        label: "Architectural Marvel",
                        significance: "Built in 1956, it\"s the seat of the state legislature of Karnataka",
                        description: "This magnificent building is constructed in the Neo-Dravidian architectural style and serves as the seat of the state legislature. The building took four years to construct and is made of Bangalore granite.",
                        dontMiss: "The intricate carvings on the facade and the imposing central dome"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=Vidhana%20Soudha%20evening%20illumination%20beautiful%20lighting%20government%20building%20night%20photography%20golden%20lights&width=375&height=200&seq=vidhana3&orientation=landscape",
                        label: "Evening Illumination",
                        significance: "Beautifully lit up every evening, creating a spectacular sight",
                        description: "The building is illuminated every evening from 6 PM to 9 PM, making it one of the most photographed landmarks in Bangalore. The golden lights highlight the architectural details beautifully.",
                        dontMiss: "The spectacular evening illumination and the reflection in the surrounding water features"
                    }
                ]
            },
            {
                url: "https://readdy.ai/api/search-image?query=Cubbon%20Park%20Bangalore%20green%20trees%20walking%20paths%20peaceful%20garden%20landscape%20300%20acre%20urban%20park%20nature&width=375&height=260&seq=cubbon1&orientation=landscape",
                label: "Cubbon Park & Museum",
                category: "Nature & Culture",
                timings: "Park: 24/7, Museum: Tue–Sun 10AM–5PM",
                duration: "60-90 mins",
                entryType: "Park Free, Museum Ticket Required",
                entryFee: "Park: Free, Museum: ₹20",
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=Cubbon%20Park%20peaceful%20walking%20paths%20green%20trees%20urban%20oasis%20nature%20photography%20families%20walking&width=375&height=200&seq=cubbon2&orientation=landscape",
                        label: "Green Oasis",
                        significance: "A 300-acre lung space in the heart of Bangalore, established in 1870",
                        description: "This sprawling park serves as the green lung of Bangalore with over 6,000 trees and numerous species of plants. It\"s a perfect place for morning walks, jogging, and family outings.",
                        dontMiss: "The bandstand, aquarium, and the toy train for children"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=Government%20Museum%20Bangalore%20colonial%20architecture%20cultural%20heritage%20building%20museum%20facade&width=375&height=200&seq=cubbon3&orientation=landscape",
                        label: "Government Museum",
                        significance: "One of the oldest museums in India, established in 1886",
                        description: "The museum houses an impressive collection of archaeological artifacts, geological specimens, and art pieces. The building itself is an example of colonial architecture.",
                        dontMiss: "The Halmidi inscription (oldest Kannada inscription) and the Venkatappa Art Gallery"
                    }
                ]
            },
            {
                url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20Indo-Islamic%20architecture%20wooden%20pillars%20heritage%20monument%20historical%20building&width=375&height=260&seq=tipu1&orientation=landscape",
                label: "Tipu Sultan Palace",
                category: "Historical Monument",
                timings: "Daily 8:30AM–5:30PM",
                duration: "30-45 mins",
                entryType: "Ticket Required",
                entryFee: "₹15-25",
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20exterior%20Indo-Islamic%20architecture%20wooden%20structure%20historical%20monument%20heritage%20building&width=375&height=200&seq=tipu2&orientation=landscape",
                        label: "Palace Architecture",
                        significance: "Summer palace of Tipu Sultan, showcasing Indo-Islamic architecture",
                        description: "Built entirely of teakwood in 1791, this two-storey structure exemplifies Indo-Islamic architecture. The palace served as Tipu Sultan\"s summer retreat and administrative headquarters.",
                        dontMiss: "The ornate wooden pillars and the beautiful frescoes on the walls"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=Tipu%20Sultan%20Palace%20interior%20wooden%20architecture%20Islamic%20designs%20palace%20chambers%20historical%20artifacts&width=375&height=200&seq=tipu3&orientation=landscape",
                        label: "Interior Chambers",
                        significance: "Preserved rooms showcasing 18th-century royal lifestyle",
                        description: "The interior features beautiful wooden carvings, ornate pillars, and historical artifacts. Each room tells the story of Tipu Sultan\"s reign and his resistance against British rule.",
                        dontMiss: "The replica of Tipu\"s throne and the collection of his personal belongings"
                    }
                ]
            },
            {
                url: "https://readdy.ai/api/search-image?query=UB%20City%20Mall%20Bangalore%20modern%20luxury%20architecture%20upscale%20shopping%20complex%20high-end%20retail%20center&width=375&height=260&seq=ub1&orientation=landscape",
                label: "UB City (Lunch Stop)",
                category: "Shopping & Dining",
                timings: "Daily 10AM–10PM",
                duration: "60-90 mins",
                entryType: "Free Entry",
                entryFee: "Free",
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=UB%20City%20mallexterior%20modern%20luxury%20architecture%20Bangalore%20upscale%20shopping%20complex%20contemporary%20design&width=375&height=200&seq=ub2&orientation=landscape",
                        label: "Luxury Complex",
                        significance: "Bangalore\"s premier luxury shopping and business destination",
                        description: "UB City is a mixed-use development featuring luxury retail stores, fine dining restaurants, offices, and service apartments. It\"s considered the most expensive piece of real estate in Bangalore.",
                        dontMiss: "The skybridge connecting different towers and the luxury brand stores"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=UB%20City%20mall%20interiorluxury%20stores%20modern%20design%20upscale%20shopping%20experience%20high-end%20retail&width=375&height=200&seq=ub3&orientation=landscape",
                        label: "Fine Dining",
                        significance: "Houses some of Bangalore\"s best restaurants and cafes",
                        description: "The complex features numerous high-end restaurants, cafes, and bars. It\"s perfect for a luxurious lunch break during your city tour with options for various cuisines.",
                        dontMiss: "The rooftop restaurants with city views and the artisanal coffee shops"
                    }
                ]
            },
            {
                url: "https://readdy.ai/api/search-image?query=Lalbagh%20Botanical%20Garden%20colorful%20flowers%20lush%20greenery%20240%20acre%20garden%20largest%20botanical%20garden&width=375&height=260&seq=lalbagh1&orientation=landscape",
                label: "Lalbagh & Bull Temple",
                category: "Nature & Spirituality",
                timings: "Lalbagh: 6AM–7PM, Temple: 6AM–12PM, 4PM–9PM",
                duration: "90-120 mins",
                entryType: "Lalbagh: Ticket Required, Temple: Free",
                entryFee: "Lalbagh: ₹25, Temple: Free",
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=Lalbagh%20Botanical%20Garden%20glass%20house%20conservatory%20flowersbotanical%20specimens%20240%20acre%20garden&width=375&height=200&seq=lalbagh2&orientation=landscape",
                        label: "Glass House & Gardens",
                        significance: "240-acre botanical garden established in 1760, modeled after Kew Gardens",
                        description: "Lalbagh houses India\"s largest collection of tropical plants and trees. The Glass House, built in 1889, hosts biannual flower shows and is modeled after London\"s Crystal Palace.",
                        dontMiss: "The Glass House flower shows (Jan & Aug) and the ancient rock formations dating back 3000 million years"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=Bull%20Temple%20Bangalore%20large%20Nandi%20statue%20traditional%20architecture%20spiritual%20monument%20Dravidian%20style&width=375&height=200&seq=bull2&orientation=landscape",
                        label: "Bull Temple",
                        significance: "Houses one of the largest monolithic Nandi statues in the world",
                        description: "Built in the 16th century, this Dravidian-style temple houses a massive monolithic statue of Nandi (sacred bull) carved from a single granite block. The statue is 15 feet high and 20 feet long.",
                        dontMiss: "The groundnut offerings tradition and the annual groundnut fair"
                    }
                ]
            },
            {
                url: "https://readdy.ai/api/search-image?query=ISKCON%20Temple%20Bangalore%20beautiful%20white%20architecture%20peaceful%20atmosphere%20modern%20temple%20complex%20spiritual%20center&width=375&height=260&seq=iskcon1&orientation=landscape",
                label: "ISKCON & St. Mary\"s Basilica",
                category: "Spiritual Heritage",
                timings: "ISKCON: 4:30AM–1PM, 4PM–8:20PM, Basilica: 6AM–7PM",
                duration: "60-75 mins",
                entryType: "Free Entry",
                entryFee: "Free (Donations accepted)",
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=ISKCON%20Temple%20Bangalore%20modern%20architecture%20white%20building%20peaceful%20spiritual%20atmosphere%20Krishna%20temple&width=375&height=200&seq=iskcon2&orientation=landscape",
                        label: "ISKCON Temple",
                        significance: "One of the largest ISKCON temples in the world, opened in 1997",
                        description: "This modern temple dedicated to Lord Krishna features contemporary architecture with traditional elements. It includes a cultural complex with multimedia shows and spiritual programs.",
                        dontMiss: "The evening aarti ceremony and the multimedia presentation on Krishna\"s life"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=St%20Mary%20Basilica%20Bangalore%20Gothic%20architecture%20oldest%20church%20heritagebuilding%20colonial%20architecture&width=375&height=200&seq=mary2&orientation=landscape",
                        label: "St. Mary\"s Basilica",
                        significance: "The oldest church in Bangalore, built in the 1840s",
                        description: "This Gothic-style church is the oldest in Bangalore and holds significant historical importance. The church features beautiful stained glass windows and hosts the annual St. Mary\"s feast.",
                        dontMiss: "The beautiful stained glass windows and the peaceful courtyard"
                    }
                ]
            },
            {
                url: "https://readdy.ai/api/search-image?query=Commercial%20Street%20Bangalore%20busy%20shopping%20arealocal%20markets%20vibrant%20street%20scene%20traditional%20bazaar&width=375&height=260&seq=commercial1&orientation=landscape",
                label: "Commercial Street & MG Road",
                category: "Shopping & Culture",
                timings: "Daily 10AM–9PM (Most shops)",
                duration: "90-120 mins",
                entryType: "Free Entry",
                entryFee: "Free",
                gallery: [
                    {
                        url: "https://readdy.ai/api/search-image?query=Commercial%20Street%20Bangalore%20busy%20shopping%20street%20local%20vendors%20traditional%20markets%20vibrant%20atmosphere&width=375&height=200&seq=commercial2&orientation=landscape",
                        label: "Commercial Street Shopping",
                        significance: "One of Bangalore\"s oldest and busiest shopping streets",
                        description: "This 1.5 km long street is a shopper\"s paradise offering everything from traditional Indian wear to modern fashion, accessories, and local handicrafts at reasonable prices.",
                        dontMiss: "The local street food, traditional silk sarees, and handcrafted jewelry"
                    },
                    {
                        url: "https://readdy.ai/api/search-image?query=MG%20Road%20Bangalore%20shopping%20areas%20urban%20lifestyle%20central%20business%20district%20modern%20commercial%20area&width=375&height=200&seq=mg2&orientation=landscape",
                        label: "MG Road District",
                        significance: "The commercial heart of Bangalore with modern shopping and dining",
                        description: "Mahatma Gandhi Road is the central business district featuring modern shopping malls, restaurants, pubs, and corporate offices. It represents modern Bangalore\"s cosmopolitan culture.",
                        dontMiss: "The Brigade Road connection, bookstores, and the famous pubs and restaurants"
                    }
                ]
            }
        ],
        itinerary: [
            {
                time: "8:00 AM",
                title: "Hotel Pickup",
                description: "Start your heritage journey with comfortable pickup from your accommodation",
                duration: ""
            },
            {
                time: "9:00 AM",
                number: "1",
                title: "Bangalore Palace",
                description: "Experience royal grandeur at this Tudor-style architectural masterpiece with beautiful gardens, vintage car collection, and ornate interiors showcasing the Wodeyar dynasty\"s rich heritage",
                duration: "45 mins"
            },
            {
                time: "10:15 AM",
                number: "2",
                title: "Vidhana Soudha",
                description: "Marvel at Karnataka\"s legislative seat featuring impressive Neo-Dravidian architecture, granite construction, and spectacular evening illumination",
                duration: "30 mins"
            },
            {
                time: "11:15 AM",
                number: "3",
                title: "Cubbon Park & Museum",
                description: "Explore Bangalore\"s green heart spanning 300 acres with over 6,000 trees, historic Government Museum housing archaeological treasures, and peaceful walking trails",
                duration: "60 mins"
            },
            {
                time: "12:45 PM",
                number: "4",
                title: "Tipu Sultan Palace",
                description: "Step into 18th-century history at this teakwood Indo-Islamic palace, Tipu Sultan\"s summer retreat featuring ornate wooden carvings, royal chambers, and historical artifacts",
                duration: "45 mins"
            },
            {
                time: "1:45 PM",
                number: "5",
                title: "UB City (Lunch Stop)",
                description: "Enjoy fine dining at Bangalore\"s premier luxury complex with high-end restaurants, rooftop city views, and sophisticated shopping experiences",
                duration: "60 mins"
            },
            {
                time: "3:15 PM",
                number: "6",
                title: "Lalbagh & Bull Temple",
                description: "Discover India\"s largest tropical plant collection at this 240-acre botanical garden with Glass House, ancient rock formations, and visit the massive monolithic Nandi statue",
                duration: "90 mins"
            },
            {
                time: "5:15 PM",
                number: "7",
                title: "ISKCON & St. Mary\"s Basilica",
                description: "Experience spiritual diversity at one of the world\"s largest ISKCON temples with multimedia shows and Bangalore\"s oldest Gothic church featuring stunning stained glass",
                duration: "60 mins"
            },
            {
                time: "6:45 PM",
                number: "8",
                title: "Commercial Street & MG Road",
                description: "Immerse in local shopping culture at this 1.5km traditional bazaar and explore the cosmopolitan central business district with modern malls, bookstores, and vibrant nightlife",
                duration: "90 mins"
            },
            {
                time: "8:00 PM",
                title: "Hotel Drop-off",
                description: "Comfortable return to your accommodation with memorable experiences",
                duration: ""
            }
        ],
        carTypes: [
            {
                id: "mini",
                name: "Go",
                seats: "3+1 Seats",
                description: "WagonR, Santro, Indica",
                acPrice: 2834,
                nonAcPrice: 2534,
                image: "https://static.readdy.ai/image/638a2981e869109b2bf5c39446e6f624/a0d6c1b50962cd0444cc6c35e689976a.png",
            },
            {
                id: "sedan",
                name: "Prime",
                seats: "4+1 Seats",
                description: "Dzire, Etios, Xcent",
                acPrice: 3134,
                nonAcPrice: 2834,
                image: "https://readdy.ai/api/search-image?query=modern%20sedan%20car%20white%20color%20side%20view%20professional%20automotive%20photography%20clean%20white%20background%20mid-size%20family%20sedan%20vehicle&width=80&height=60&seq=sedan-car&orientation=landscape",
            },
            {
                id: "suv",
                name: "Edge",
                seats: "4+1 Seats",
                description: "Creta, Seltos",
                acPrice: 3834,
                nonAcPrice: 3534,
                image: "https://readdy.ai/api/search-image?query=modern%20SUV%20car%20white%20color%20side%20view%20professional%20automotive%20photography%20clean%20white%20background%20compact%20SUV%20crossover%20vehicle&width=80&height=60&seq=suv-car&orientation=landscape",
            },
            {
                id: "suv+",
                name: "Max",
                seats: "6+1 Seats",
                description: "Ertiga, Innova, Crysta",
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
};