import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import useForm from "../../mixins/useForm";
import Image from "next/image";
import CREATE_OTTER from "../../lib/mutations/createOtter";
import {
  CreateOtterInput,
  MutationCreateOtterArgs,
  useCreateOtterMutation,
} from "../../lib/graphql";
import { initializeApollo } from "../../lib/apollo";
import { useS3Upload, getImageData } from "next-s3-upload";

export interface CreateProps {}

const Create: React.SFC<CreateProps> = () => {
  const initialState = {
    name: "",
    location: "",
    about: "",
  };
  const inputImage = useRef<HTMLInputElement>(null);
  const {
    onChange,
    onSubmit,
    values: form,
  } = useForm(createOtterCallback, initialState);
  let [imageUrl, setImageUrl] = useState("");
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  async function createOtterCallback() {
    const client = initializeApollo();
    // console.log({ ...form, imageFile });
    const { data } = await client.mutate<MutationCreateOtterArgs>({
      mutation: CREATE_OTTER,
      variables: {
        input: {
          ...form,
          imageUrl,
        },
      },
    });
    console.log(data);
  }

  const onImageChange = async (file: File) => {
    let { url } = await uploadToS3(file);
    setImageUrl(url);
  };

  const onImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    openFileDialog();
    if (inputImage && inputImage.current) inputImage.current.click();
  };

  const onImageRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImageUrl("");
  };

  return (
    <Layout>
      <div className="mt-5">
        <div>
          <form onSubmit={onSubmit}>
            <div className="text-2xl text-center font-medium">Create Otter</div>
            <div className="m-5 lg:grid grid-cols-12 gap-5">
              <div className="md:col-span-4 col-span-12 md:h-auto flex justify-center">
                <div className="relative w-72 h-7w-72 rounded-full mt-5">
                  <div className="relative inline-block">
                    <FileInput
                      onChange={onImageChange}
                      type="file"
                      id="image"
                      name="image"
                      className="hidden"
                    />
                    {/* <input
                      type="file"
                      id="image"
                      name="image"
                      className="hidden"
                      ref={inputImage}
                      onChange={onImageChange}
                    /> */}
                    <div className="h-72 w-72 relative">
                      <Image
                        src={imageUrl || "/otter_1.jpg"}
                        alt="Otter Picture"
                        layout="fill" // required
                        objectFit="cover" // change to suit your needs
                        className="rounded-full" // just an example
                      />
                    </div>
                    {/* <img
                      src={form.src || "/otter_1.jpg"}
                      alt="Otter Picture"
                      className="h-full w-full object-cover rounded-full"
                    /> */}
                    <div className="hover:shadow-lg absolute top-0 h-full w-full rounded-full text-white bg-black bg-opacity-25 flex text-center items-center justify-center ">
                      <button
                        onClick={onImageUpload}
                        className="p-2 focus:outline-none hover:bg-white hover:bg-opacity-25 rounded-full transition duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                      {imageUrl && (
                        <button
                          onClick={onImageRemove}
                          className="p-2 focus:outline-none hover:bg-white hover:bg-opacity-25 rounded-full transition duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-8 col-span-12 space-y-5">
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    onChange={onChange}
                    required
                    className="p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Location"
                    onChange={onChange}
                    required
                    className="p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <textarea
                    rows={5}
                    id="about"
                    name="about"
                    placeholder="About"
                    onChange={onChange}
                    required
                    className="p-2 w-full"
                  />
                </div>
                <div>
                  <button className="w-full bg-blue-500 text-white p-2 rounded-md font-medium hover:shadow-lg">
                    Add Otter
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Create;