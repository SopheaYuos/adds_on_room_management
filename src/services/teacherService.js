const KEYS = {
  rooms: "teachers",
  roomId: "teacherId",
};
export const getDepartmentCollection = () => [
  { id: "1", title: "GIC" },
  { id: "2", title: "GCI" },
  { id: "3", title: "GEE" },
  { id: "4", title: "OAC" },
  { id: "5", title: "GTR" },
  { id: "6", title: "GTC" },
  { id: "7", title: "GCA" },
];

export function insertTeacher(data) {
  console.log(data, "API Createted teacher");


  let teachers = getAllTeachers();
  data["id"] = generateTeacherId();
  teachers.push(data);
  localStorage.setItem(KEYS.teachers, JSON.stringify(teachers));
}

export function updateTeacher(data) {
  let teachers = getAllTeachers();
  let recordIndex = teachers.findIndex((x) => x.id == data.id);
  teachers[recordIndex] = { ...data };
  localStorage.setItem(KEYS.teachers, JSON.stringify(teachers));
}

export function deleteTeacher(id) {
  let teachers = getAllTeachers();
  teachers = teachers.filter((x) => x.id != id);
  localStorage.setItem(KEYS.teachers, JSON.stringify(teachers));
}

export function generateTeacherId() {
  if (localStorage.getItem(KEYS.teacherId) == null)
    localStorage.setItem(KEYS.teacherId, "0");
  var id = parseInt(localStorage.getItem(KEYS.teacherId));
  localStorage.setItem(KEYS.teacherId, (++id).toString());
  return id;
}

export function getAllTeachers() {
  if (localStorage.getItem(KEYS.teachers) == null)
    localStorage.setItem(KEYS.teachers, JSON.stringify([]));
  let teachers = JSON.parse(localStorage.getItem(KEYS.teachers));
  //map departmentID to department title
  let departments = getDepartmentCollection();
  return teachers.map((x) => ({
    ...x,
    department: departments[x.departmentId - 1].title,
  }));
}
