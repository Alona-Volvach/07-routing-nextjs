"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NoteTag } from "../../types/note";
import { createNote } from "@/lib/api";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

export interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .required("Title is required"),

  content: Yup.string().max(500, "Max 500 characters"),

  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError: (err) => {
    console.error("CREATE NOTE ERROR:", err);
  },
  });

  const handleSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    try {
      console.log("SUBMIT FIRED", values);

      await createMutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form} aria-busy={createMutation.isPending}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;