import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { axiosClientWithAuth } from "@/libs/axiosClient";

interface ModalAddProps {
  modalTitle?: React.ReactNode;
  onSuccess?: () => void;
  params: string;
}

const schema = z.object({
  namaDepan: z.string().min(1, "Nama Depan wajib diisi"),
  namaBelakang: z.string().min(1, "Nama Belakang wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  jenisKelamin: z.union([z.enum(["pria", "perempuan"]), z.literal("")]),
  tanggalLahir: z.string(),
  password: z.string(),
  noHp: z.string(),
  alamat: z.string(),
});

type FormData = z.infer<typeof schema>;

const ModalAdding = ({ modalTitle, onSuccess, params }: ModalAddProps) => {
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
      alamat: "",
      noHp: "",
    },
  });

  const openModal = () => {
    const dialog = document.getElementById(
      "modalAdd_01",
    ) as HTMLDialogElement | null;
    if (dialog) dialog.showModal();
  };

  const closeModal = () => {
    const dialog = document.getElementById(
      "modalAdd_01",
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.close();
    }
  };

  const onFormSubmit = async (formData: FormData) => {
    try {
      const client = axiosClientWithAuth();
      let dataToSend;

      if (params === "admin") {
        const { noHp, alamat, ...rest } = formData;
        dataToSend = rest;
      } else if (params === "pegawai") {
        const { password, tanggalLahir, ...rest } = formData;
        dataToSend = rest;
      }

      await client.post(`/${params}`, dataToSend);
      if (onSuccess) onSuccess();
      closeModal();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <button onClick={openModal} className="btn btn-active btn-primary">
        Tambah
      </button>

      <dialog id="modalAdd_01" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">{modalTitle}</h3>

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
            </div>

            <div>
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
              {errors.jenisKelamin && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.jenisKelamin.message}
                </p>
              )}
            </div>

            {params === "admin" && (
              <>
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
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    className="input w-full"
                    placeholder="Entry your password..."
                    {...register("password")}
                  />
                </div>
              </>
            )}

            {params === "pegawai" && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    No Hp
                  </label>
                  <input
                    required
                    type="text"
                    className="input w-full"
                    placeholder="Entry your No Hp..."
                    {...register("noHp")}
                  />
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
              </>
            )}
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
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
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ModalAdding;
