import TeacherClient from "./TeacherClient";

export async function generateStaticParams() {
  return [{ id: "1" }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <TeacherClient id={params.id} />;
}