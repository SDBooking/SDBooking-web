import { Autocomplete, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export type renameModel = {
  name: string;
};

export type renameDTO = {
  id: number;
  name: string;
};

function RoomEditor({
  target,
  handle,
  cancel,
}: {
  target: renameDTO;
  handle: (data: renameDTO) => void;
  cancel?: () => void;
}) {
  const { control, handleSubmit } = useForm<renameModel>({
    defaultValues: target,
  });

  const onSubmit = (data: renameModel) => {
    handle({ ...target, ...data });
    toast.success("บันทึกสำเร็จ!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-screen max-w-sm">
      <div className="p-6">
        <div>
          <Controller
            name="name"
            control={control}
            rules={{ required: "กรุณากรอกข้อมูลให้ครบ" }}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                freeSolo
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ชื่อใหม่"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    className="w-full border rounded-xl px-2 py-1"
                  />
                )}
                onInputChange={(_, value) => field.onChange(value)}
              />
            )}
          />
        </div>
      </div>

      <div className="rounded-b-xl bg-gray-50 px-4 py-3 flex flex-row-reverse justify-center md:justify-start md:px-6 gap-4">
        <Button type="submit" variant="contained" color="success">
          ตกลง
        </Button>
        {cancel && (
          <Button onClick={cancel} variant="contained" color="error">
            ยกเลิก
          </Button>
        )}
      </div>
    </form>
  );
}

export default RoomEditor;
