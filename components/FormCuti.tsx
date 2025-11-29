"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosClientWithAuth } from "@/libs/axiosClient";

interface FormCutiProps {
  idPegawai?: number;
  successFormCuti?: () => void;
}

const schema = z.object({
  alasan: z.string().min(1, "Alasan harus diisi"),
  tanggalMulai: z.string().min(1, "Tanggal mulai harus diisi"),
  tanggalSelesai: z.string().min(1, "Tanggal selesai harus diisi"),
});

type FormData = z.infer<typeof schema>;

const FormCuti = ({ idPegawai, successFormCuti }: FormCutiProps) => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const newData = { ...data, pegawaiId: idPegawai };
      const client = axiosClientWithAuth();
      await client.post(`/cuti`, newData);
      if (successFormCuti) successFormCuti();
    } catch (err: any) {
      setMessage(err?.response?.data?.message);
    } finally {
      setTimeout(() => setMessage(""), 6000);
    }
  };

  return (
    <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
      <input type="checkbox" />
      <div className="collapse-title font-semibold">Form Cuti</div>
      <div className="collapse-content text-sm space-y-3 md:space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Alasan
          </label>
          <textarea
            {...register("alasan")}
            className="textarea w-full"
            placeholder="Entry alasan..."
          />
          {errors.alasan && (
            <p className="text-red-500 text-xs mt-1">{errors.alasan.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tanggal Mulai
            </label>
            <input
              type="date"
              {...register("tanggalMulai")}
              className="input w-full"
            />
            {errors.tanggalMulai && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tanggalMulai.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tanggal Selesai
            </label>
            <input
              type="date"
              {...register("tanggalSelesai")}
              className="input w-full"
            />
            {errors.tanggalSelesai && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tanggalSelesai.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="btn btn-block btn-sm text-sm bg-green-700 text-white hover:opacity-90 shadow-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Tambah Cuti
          </button>
        </div>
        {message.length > 0 && (
          <div className="flex justify-center">
            <div className="mt-2 badge badge-error">{message}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCuti;
