"use client";
import { IPersonProps, TablePerson } from "@/components/table-person";
import { useEffect, useState } from "react";
import { getPersonsPaginated } from "./services/person.service";

export default function Home() {
  const [persons, setPersons] = useState<IPersonProps[]>([]);

  useEffect(() => {
    const fetchPersons = async () => {
      const response = await getPersonsPaginated(0, 10);
      setPersons(response.content);
    };
    fetchPersons();
  }, []);

  const handlePersonDeleted = (personId: string) => {
    setPersons((prevPersons) =>
      prevPersons.filter((person) => person.id != personId)
    );
  };

  return (
    <main className="w-[95%] p-8 gap-4 mt-10 mx-auto rounded-xl">
      <div className="flex flex-row gap-2 justify-start items-center mb-2 py-3 tracking-wider h-12 text-3xl font-extrabold">
        <h3>Pessoas</h3>
      </div>
      <TablePerson data={persons} onPersonDeleted={handlePersonDeleted} />
    </main>
  );
}
