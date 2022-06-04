import styled from "styled-components";

type Props = {
  label: string;
  placeholder: string;
  textarea?: boolean;
}

export function Input({ label, placeholder, textarea}: Props) {

  return (
    <Container>
      <h6>{label}</h6>
      {textarea ? (
        <textarea
          className="white-field"
          name={label}
          rows={4}
          placeholder={placeholder}/>
      ) : (
        <input
          className="white-field"
          name={label}
          type="text"
          placeholder={placeholder}
        />
      )}
      </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  
  .white-field, .white-field-bottom, .white-field-100 {
    background-color: #fff;
    border: solid 1px #D9D9D9;
    border-radius: 10px 10px 10px 10px;
    font-size: 16px;
    color: var(--main-dark-color);
    margin-bottom: 20px;
    padding: 18px;
  }

  .white-field-100 {
    width: 100%;
  }

  ::placeholder {
    color: var(--placeholder-text-color);
  }

  .white-field h5, .white-field-bottom h5 {
    font-weight: 400;
  }

  .white-field-bottom {
    margin-bottom: 50px;
  }
`;
