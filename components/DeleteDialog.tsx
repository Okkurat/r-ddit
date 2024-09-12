import React from 'react';

interface DeleteDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog = ({ onClose, onConfirm }: DeleteDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#171717] p-6 rounded border border-[#242424] max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this message?</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#242424] text-[#CCCCCC] hover:bg-[#3E3F3E] px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#242424] text-[#CCCCCC] hover:bg-[#3E3F3E] px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;