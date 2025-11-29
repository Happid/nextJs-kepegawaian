"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "@/components/Toast";
import { axiosClientWithAuth } from "@/libs/axiosClient";

interface AdminData {
  namaDepan: string;
  namaBelakang: string;
  email: string;
  tanggalLahir: string;
  jenisKelamin: "pria" | "perempuan" | "";
}

interface ModalButtonProps {
  buttonLabel?: React.ReactNode;
  modalTitle?: React.ReactNode;
  modalId?: number | string;
  data?: AdminData;
  onSuccess?: () => void;
}

const schema = z.object({
  namaDepan: z.string().min(1, "Nama Depan wajib diisi"),
  namaBelakang: z.string().min(1, "Nama Belakang wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  tanggalLahir: z.string().min(1, "Tanggal Lahir wajib diisi"),
  jenisKelamin: z.enum(["pria", "perempuan"], "Jenis Kelamin wajib dipilih"),
});

type FormData = z.infer<typeof schema>;

const Modal = ({
  buttonLabel = "Open Modal",
  modalTitle = "Modal Title",
  modalId,
  data,
  onSuccess,
}: ModalButtonProps) => {
  const dialogId = `modal_${modalId}`;
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data || {
      namaDepan: "",
      namaBelakang: "",
      email: "",
      tanggalLahir: "",
      jenisKelamin: "" as any,
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => setIsClient(true), []);

  const openModal = () => {
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    if (dialog) dialog.showModal();
  };

  const closeModal = () => {
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.close();
      reset(data);
    }
  };

  const onFormSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const client = axiosClientWithAuth();
      await client.patch(`/admin/${modalId}`, formData);
      setMessage(`Edit ${formData.namaDepan} Berhasil`);
      if (onSuccess) onSuccess();
      closeModal();
    } catch (err: any) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Gagal edit data");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        setIsError(false);
      }, 5000);
    }
  };

  return (
    <>
      {message.length > 0 && <Toast message={message} isError={isError} />}
      <button onClick={openModal} className="btn btn-circle hover:text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>

      <dialog id={dialogId} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{modalTitle}</h3>
          <form
            className="space-y-4 md:space-y-6 text-start py-4"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nama Depan
              </label>
              <input
                required
                type="text"
                className="input w-full"
                placeholder="Entry your Nama Depan..."
                {...register("namaDepan")}
              />
              {errors.namaDepan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.namaDepan.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nama Belakang
              </label>
              <input
                type="text"
                className="input w-full"
                placeholder="Entry your Nama Belakang..."
                {...register("namaBelakang")}
              />
              {errors.namaBelakang && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.namaBelakang.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                className="input w-full"
                placeholder="Entry your email..."
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tanggal Lahir
              </label>
              <input
                type="date"
                className="input w-full"
                {...register("tanggalLahir")}
              />
              {errors.tanggalLahir && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tanggalLahir.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Jenis Kelamin
              </label>
              <select
                className="select w-full"
                {...register("jenisKelamin")}
                defaultValue={data?.jenisKelamin || ""}
              >
                <option value="" disabled>
                  Pilih Jenis Kelamin
                </option>
                <option value="pria">Pria</option>
                <option value="perempuan">Perempuan</option>
              </select>
              {errors.jenisKelamin && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.jenisKelamin.message}
                </p>
              )}
            </div>

            <div className="modal-action">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
