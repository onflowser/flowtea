import styled from "styled-components";
import { createRef } from "react";
import { colors } from "../common/theme";
import { SpinnerCircular } from "spinners-react";

export type ImageInputProps = {
  placeholder?: string;
  imageSrc?: string | null;
  imageFile?: File | null;
  isLoading?: boolean;
  disabled?: boolean;
  onInput?: (file: File) => void;
};

export function ImageInput({
  placeholder,
  imageSrc,
  imageFile,
  onInput,
  isLoading,
  disabled,
}: ImageInputProps) {
  const inputRef = createRef<HTMLInputElement>();
  const imageFilePreviewSrc = imageFile ? URL.createObjectURL(imageFile) : null;
  const hasCustomImage = imageFilePreviewSrc || imageSrc;

  function handleOnInput() {
    const file = inputRef.current?.files?.[0];
    if (file) {
      onInput?.(file);
    }
  }

  return (
    <Container>
      <Input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        onInput={handleOnInput}
        disabled={isLoading || disabled}
      />
      {isLoading && (
        <LoaderWrapper>
          <SpinnerCircular
            size={50}
            thickness={100}
            speed={100}
            color={colors.white}
            secondaryColor={colors.grey}
          />
        </LoaderWrapper>
      )}
      <Image
        src={imageFilePreviewSrc || imageSrc || "/images/add-profile-photo.svg"}
        alt=""
      />
      {!hasCustomImage && <p>{placeholder}</p>}
    </Container>
  );
}

const Container = styled.label`
  cursor: pointer;
  position: relative;
  display: inline-block;
`;

const Input = styled.input`
  display: none;
`;

const Image = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 50%;
`;

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(1px);
`;
