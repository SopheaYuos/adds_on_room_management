const KEYS = {
    rooms: 'rooms',
    roomId: 'roomId'
}



export function insertRoom(data) {
    let rooms = getAllRooms();
    data['id'] = generateRoomId()
    rooms.push(data)
    localStorage.setItem(KEYS.rooms, JSON.stringify(rooms))
}

export function updateRoom(data) {
    let rooms = getAllRooms();
    let recordIndex = rooms.findIndex(x => x.id == data.id);
    rooms[recordIndex] = { ...data }
    localStorage.setItem(KEYS.rooms, JSON.stringify(rooms));
}

export function deleteRoom(id) {
    let rooms = getAllRooms();
    rooms = rooms.filter(x => x.id != id)
    localStorage.setItem(KEYS.rooms, JSON.stringify(rooms));
}

export function generateRoomId() {
    if (localStorage.getItem(KEYS.roomId) == null)
        localStorage.setItem(KEYS.roomId, '0')
    var id = parseInt(localStorage.getItem(KEYS.roomId))
    localStorage.setItem(KEYS.roomId, (++id).toString())
    return id;
}

export function getAllRooms() {
    if (localStorage.getItem(KEYS.rooms) == null)
        localStorage.setItem(KEYS.rooms, JSON.stringify([]))
    let rooms = JSON.parse(localStorage.getItem(KEYS.rooms));
    //map departmentID to department title
    return rooms.map(x => ({
        ...x,
    }))
   
}