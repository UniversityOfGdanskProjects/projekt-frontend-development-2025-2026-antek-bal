const firstNames = ["John", "Alice", "Bob", "Emma", "David", "Sarah", "Michael", "Olivia", "Daniel", "Sophia", "James", "Emily", "Robert", "Charlotte", "William", "Mia", "Joseph", "Amelia", "Thomas", "Harper"];
const lastNames = ["Doe", "Smith", "Johnson", "Brown", "Williams", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson"];
const postSentences = [
    "Feeling motivated today! Staying focused on my goals.",
    "Just had the best coffee ever ☕",
    "Does anyone know a good place for hiking?",
    "Coding all night long... #developer #life",
    "Check out this amazing view!",
    "Can't believe it's already Friday.",
    "Learning React is fun but challenging.",
    "New day, new chances. Grateful for every step forward.",
    "Working quietly, letting results speak later.",
    "Pizza or Sushi? Help me decide! 🍕🍣",
    "Just finished a great workout.",
    "Listening to some lo-fi beats.",
    "Progress isn’t always loud, but it’s always worth it.",
    "Sunset vibes 🌅",
    "Missing the summer days."
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

const users = Array.from({ length: 50 }, (_, i) => {
    const id = i + 1;
    const name = id === 1 ? "John" : getRandom(firstNames);
    const surname = id === 1 ? "Doe" : getRandom(lastNames);
    const username = `${name.toLowerCase()}_${surname.toLowerCase()}${id}`;

    const friendsCount = getRandomInt(0, 5);
    const friends = [];
    for(let j=0; j<friendsCount; j++) {
        const friendId = getRandomInt(1, 50);
        if(friendId !== id && !friends.includes(friendId)) friends.push(friendId);
    }

    return {
        "id": id,
        "username": username,
        "password": "cGFzc3dvcmQ=",
        "name": name,
        "surname": surname,
        "avatar": `https://i.pravatar.cc/150?img=${id}`,
        "friends": friends,
        "followers": friends,
        "following": friends,
        "friendRequests": [],
        "role": id === 1 ? "admin" : "user",
        "isBlocked": false
    };
});

let posts = [];
let postIdCounter = 1;

users.forEach(user => {
    const postsCount = getRandomInt(10, 20);

    for (let i = 0; i < postsCount; i++) {
        const hasMedia = Math.random() > 0.6;
        const visibilityOptions = ["public", "public", "public", "friends", "private"];

        posts.push({
            "id": postIdCounter++,
            "author": user.id,
            "description": `${getRandom(postSentences)} ${getRandom(postSentences)}`,
            "media": hasMedia ? `https://picsum.photos/seed/${postIdCounter}/500/300` : null,
            "visibility": getRandom(visibilityOptions),
            "date": getRandomDate(new Date(2024, 0, 1), new Date()),
            "likes": getRandomInt(0, 50),
            "likedBy": [],
            "comments": []
        });
    }
});

const events = [
    {
        "id": 1,
        "organizer": 1,
        "title": "React Conf 2024",
        "description": "The biggest conference for React developers.",
        "date": "2024-05-15T09:00",
        "location": "Nevada, USA",
        "participants": [2, 3, 4, 5, 10]
    },
    {
        "id": 2,
        "organizer": 2,
        "title": "Summer BBQ Party",
        "description": "Chill vibes, good food and music.",
        "date": "2024-07-20T18:00",
        "location": "Central Park, NY",
        "participants": [1, 3]
    },
    {
        "id": 3,
        "organizer": 5,
        "title": "Tech Meetup: AI Trends",
        "description": "Discussing the future of Artificial Intelligence.",
        "date": "2024-11-10T17:30",
        "location": "Online / Zoom",
        "participants": [1, 2, 6, 7, 8]
    },

    {
        "id": 4,
        "organizer": 1,
        "title": "Opener Festival 2026",
        "description": "Open’er Festival is one of Europe’s largest music festivals, held annually in Gdynia, Poland.",
        "date": "2026-07-03T14:00",
        "location": "Gdynia, Poland",
        "participants": [1, 3, 12, 15]
    },
    {
        "id": 5,
        "organizer": 3,
        "title": "Weekend Hiking Trip",
        "description": "Going to the mountains for a 2-day hike. Bring sturdy shoes!",
        "date": "2026-09-12T08:00",
        "location": "Zakopane, Poland",
        "participants": [2, 4]
    },
    {
        "id": 6,
        "organizer": 4,
        "title": "JavaScript Workshop",
        "description": "Advanced patterns in JS. Free entry for students.",
        "date": "2026-10-05T16:00",
        "location": "Warsaw, Poland",
        "participants": []
    },
    {
        "id": 7,
        "organizer": 10,
        "title": "Christmas Charity Gala",
        "description": "Annual charity event to support local shelters.",
        "date": "2026-12-20T19:00",
        "location": "Hotel Marriott",
        "participants": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
];

export { users, posts, events };