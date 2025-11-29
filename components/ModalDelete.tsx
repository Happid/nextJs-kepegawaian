import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { axiosClientWithAuth } from "@/libs/axiosClient";

interface ModalDeleteProps {
  modalId?: number | string;
  nama?: string;
  onSuccess?: () => void;
  params?: string;
}

const ModalDelete = ({
  modalId,
  nama,
  onSuccess,
  params,
}: ModalDeleteProps) => {
  const dialogId = `modal_delete_${modalId}`;
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);

    try {
      const client = axiosClientWithAuth();
      await client.delete(`/${params}/${modalId}`);
      setMessage(`Data ${nama} telah terhapus`);
      if (onSuccess) onSuccess();
      closeModal();
    } catch (err: any) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Gagal hapus");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        setIsError(false);
      }, 5000);
    }
  };

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
    }
  };

  return (
    <>
      {message.length > 0 && <Toast message={message} isError={isError} />}
      <button onClick={openModal} className="btn btn-circle hover:text-red-500">
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>

      <dialog id={dialogId} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg">
            Apakah anda yakin ingin menghapus data <br />
            <span className="font-semibold  underline">{nama} </span>?
          </h3>

          <div className="modal-action">
            <button
              disabled={loading}
              onClick={onDelete}
              type="submit"
              className="btn btn-secondary"
            >
              {loading ? "Loading..." : "Yakin"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}
            >
              Tidak
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalDelete;
