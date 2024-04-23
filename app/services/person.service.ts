import axios from "axios";

export const getPersonById = async (id: string) => {
  const { data } = await axios.get(
    `http://localhost:8080/person/findById/${id}`
  );
  return data;
};

export const getPersonsPaginated = async (page: number, size: number) => {
  const { data } = await axios.get(
    `http://localhost:8080/person/paginate?page=${page}&size=${size}`
  );
  return data;
};

export const deletePerson = async (id: string) => {
  await axios.delete(`http://localhost:8080/person/delete/${id}`);
};

export const createPerson = async (person: any) => {
  await axios.post(`http://localhost:8080/person/create`, person);
};

export const updatePerson = async (id: string, person: any) => {
  await axios.patch(`http://localhost:8080/person/update/${id}`, person);
};
