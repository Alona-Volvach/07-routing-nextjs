"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import { getNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const close = () => router.back();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
    enabled: !!id,
  });

  return (
    <Modal onClose={close}>
      <button className={css.backBtn} onClick={close}>
        Close
      </button>

      {isLoading && <p>Loading...</p>}

      {isError && <p>Error: {(error as Error).message}</p>}

      {note && (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <p>{note.tag}</p>
        </div>
      )}
    </Modal>
  );
}