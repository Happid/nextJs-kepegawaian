"use client";

import { PegawaiData } from "@/app/(dashboard)/pegawai/page";
import FormCuti from "@/components/FormCuti";
import { useEffect, useState } from "react";
import { axiosClientWithAuth } from "@/libs/axiosClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Toast from "@/components/Toast";
import ModalDelete from "@/components/ModalDelete";

interface ModalButtonProps {
  buttonLabel?: React.ReactNode;
  modalTitle?: React.ReactNode;
  modalId?: number | string;
  data?: PegawaiData;
  onSuccess?: () => void;
}

const schema = z.object({
  namaDepan: z.string().min(1, "Nama Depan harus diisi"),
  namaBelakang: z.string().min(1, "Nama Depan harus diisi"),
  email: z.string().email("Format email tidak valid"),
  noHp: z.string().min(1, "No Hp harus diisi"),
  jenisKelamin: z.string().min(1, "Jenis kelamin harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
});
type FormData = z.infer<typeof schema>;

const ModalPegawai = ({ modalId, data, onSuccess }: ModalButtonProps) => {
  const dialogId = `modal_${modalId}`;
  const [tblCuti, setTblCuti] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openModal = () => {
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.showModal();
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.close();
      setIsOpen(false);
    }
  };

  async function fetchData() {
    try {
      const client = axiosClientWithAuth();
      const res = await client.get(`/pegawai/${modalId}`);

      reset({
        namaDepan: res.data.namaDepan || "",
        namaBelakang: res.data.namaBelakang || "",
        email: res.data.email || "",
        noHp: res.data.noHp || "",
        jenisKelamin: res.data.jenisKelamin || "",
        alamat: res.data.alamat,
      });
      setTblCuti(res.data.cuti || []);
    } catch (err: any) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleFormCuti = () => {
    fetchData();
  };

  const onFormSubmit = async (formData: FormData) => {
    try {
      const client = axiosClientWithAuth();
      await client.patch(`/pegawai/${modalId}`, formData);
      if (onSuccess) onSuccess();
      closeModal();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <>
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

      <dialog id={dialogId} className="z-50 modal modal-bottom sm:modal-middle">
        <div className="z-50 modal-box">
          <h3 className="font-bold text-lg">Detail Pegawai</h3>
          <div className="space-y-4 md:space-y-6 text-start py-4">
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
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                No Hp
              </label>
              <input
                type="text"
                className="input w-full"
                placeholder="Entry your email..."
                {...register("noHp")}
              />
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
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Alamat
              </label>
              <textarea
                {...register("alamat")}
                className="textarea w-full"
                placeholder="Entry alamat mu..."
              ></textarea>
            </div>

            {/*TABKE CUTI*/}
            <FormCuti idPegawai={data?.id} successFormCuti={handleFormCuti} />

            <div className="overflow-x-auto bg-white">
              <table className="table w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th>No</th>
                    <th>Alasan</th>
                    <th>Tgl Mulai</th>
                    <th>Tgl Selsai</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tblCuti?.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center p-4">
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                  {tblCuti?.map((cuti: any, index: number) => (
                    <tr className="text-xs" key={cuti.id}>
                      <td>{index + 1}</td>
                      <td>{cuti.alasan}</td>
                      <td>
                        <span className="whitespace-nowrap badge badge-ghost badge-sm">
                          {cuti.tanggalMulai}
                        </span>
                      </td>
                      <td>
                        <span className="whitespace-nowrap badge badge-ghost badge-sm">
                          {cuti.tanggalSelesai}
                        </span>
                      </td>
                      <td className="text-center">
                        <ModalDelete
                          modalId={cuti.id}
                          nama={""}
                          onSuccess={handleFormCuti}
                          params="cuti"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={handleSubmit(onFormSubmit)}
                className="btn btn-primary"
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalPegawai;
