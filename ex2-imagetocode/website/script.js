const rooms = [
  {
    name: "De Luxe Room",
    occupancy: "2 adults | 1 child below 7",
    price: "from $189 a night",
    image: "./images/room-deluxe.jpg",
    alt: "Deluxe bedroom with a large window"
  },
  {
    name: "De Luxe Sea View",
    occupancy: "2 adults | 1 child below 7",
    price: "from $209 a night",
    image: "./images/room-sea-view.jpg",
    alt: "Sea-facing room with a lounge area"
  },
  {
    name: "The Wellhall Family Suite",
    occupancy: "4 adults | 2 children below 7",
    price: "from $399 a night",
    image: "./images/room-family-suite.jpg",
    alt: "Spacious family suite with warm lighting"
  }
];

const roomList = document.getElementById("room-list");

roomList.innerHTML = rooms
  .map(
    (room) => `
      <article class="room-card">
        <img class="room-image" src="${room.image}" alt="${room.alt}" loading="lazy" />
        <div class="room-content">
          <p class="room-occupancy">${room.occupancy}</p>
          <h2 class="room-name">${room.name}</h2>
          <p class="room-price">${room.price}</p>
        </div>
      </article>
    `
  )
  .join("");
