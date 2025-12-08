const users = [
    {
        "id": 1,
        "name": "John",
        "surname": "Doe",
        "avatar": "https://i.pravatar.cc/150?img=1",
        "friends": [2, 3]
    },
    {
        "id": 2,
        "name": "James",
        "surname": "Buck",
        "avatar": "https://i.pravatar.cc/150?img=2",
        "friends": [1, 3]
    },
    {
        "id": 3,
        "name": "Joseph",
        "surname": "Singer",
        "avatar": "https://i.pravatar.cc/150?img=3",
        "friends": [1, 2]
    }
]

const posts = [
    {
        "id": 1,
        "author": 1,
        "description": "Feeling motivated today! Staying focused on my goals and taking small steps forward every day. Let’s keep growing.",
        "media": "https://picsum.photos/300/200",
        "visibility": "friends",
        "date": "2025-02-14T09:22:00",
        "likes": 3
    },
    {
        "id": 2,
        "author": 3,
        "description": "New day, new chances. Grateful for every step forward.",
        "media": null,
        "visibility": "private",
        "date": "2025-05-30T18:05:00",
        "likes": 1
    },
    {
        "id": 3,
        "author": 3,
        "description": "Progress isn’t always loud, but it’s always worth it.",
        "media": "https://picsum.photos/300/200",
        "visibility": "public",
        "date": "2025-08-11T03:47:00",
        "likes": 0
    },
    {
        "id": 4,
        "author": 2,
        "description": "Working quietly, letting results speak later.",
        "media": null,
        "visibility": "friends",
        "date": "2025-12-04T21:10:00",
        "likes": 2
    }
]

export {users, posts}