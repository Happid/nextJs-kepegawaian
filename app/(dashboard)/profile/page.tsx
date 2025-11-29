"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosClientWithAuth } from "@/libs/axiosClient";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

const schema = z.object({
  namaDepan: z.string().min(1, "Nama Depan wajib diisi"),
  namaBelakang: z.string().min(1, "Nama Belakang wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  jenisKelamin: z.enum(["pria", "perempuan"], "Jenis Kelamin wajib dipilih"),
  tanggalLahir: z.string(),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

const ProfilePage = () => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      jenisKelamin: "",
      namaBelakang: "",
      namaDepan: "",
      password: "",
      tanggalLahir: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const client = axiosClientWithAuth();
      const adminId = localStorage.getItem("adminId");
      const res = await client.get(`/admin/${adminId}`);

      reset({
        namaDepan: res.data.data.namaDepan || "",
        namaBelakang: res.data.data.namaBelakang || "",
        email: res.data.data.email || "",
        tanggalLahir: res.data.data.tanggalLahir || "",
        jenisKelamin: res.data.data.jenisKelamin || "",
        password: res.data.data.password || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onFormSubmit = async (formData: FormData) => {
    try {
      const id = localStorage.getItem("adminId");
      const client = axiosClientWithAuth();
      let dataToSend;

      if (!formData.password) {
        const { password, ...rest } = formData;
        dataToSend = rest;
      } else {
        dataToSend = formData;
      }

      await client.patch(`/admin/${id}`, dataToSend);
      setMessage("data berhasil diperbarui");
    } catch (err: any) {
      setMessage(err.response?.data?.errors?.message || "");
    } finally {
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <>
      {message.length > 0 && (
        <div className="toast toast-top toast-end">
          <div className={`alert alert-success`}>
            <span className="flex items-center justify-center">{message}</span>
          </div>
        </div>
      )}

      <div className="hero bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Profile Kamu</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex justify-center gap-4 mx-auto md:max-w-xl w-full">
          <div className="w-1/2">
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

            <label className="mt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              required
              type="email"
              className="input w-full"
              placeholder="Entry your email..."
              {...register("email")}
            />

            <label className="block mt-5 mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Jenis Kelamin
            </label>
            <select
              className="select w-full"
              {...register("jenisKelamin")}
              defaultValue={""}
            >
              <option value="" disabled>
                Pilih Jenis Kelamin
              </option>
              <option value="pria">Pria</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nama Belakang
            </label>
            <input
              required
              type="text"
              className="input w-full"
              placeholder="Entry your Nama Belakang..."
              {...register("namaBelakang")}
            />

            <label className="mt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tanggal Lahir
            </label>
            <input
              required
              type="date"
              className="input w-full"
              {...register("tanggalLahir")}
            />

            <label className="mt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password Baru
            </label>
            <input
              type="password"
              className="input w-full"
              placeholder="Entry your password..."
              {...register("password")}
            />
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button type="submit" className="btn btn-primary">
            Perbarui Profile Kamu
          </button>
        </div>
      </form>
    </>
  );
};

export default ProfilePage;
