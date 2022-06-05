import { useFcl } from "../common/FclContext";
import styled, { css } from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import Switch from "react-switch";
import { colors } from "../common/theme";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUserInfo } from "../common/use-user-info";

export default function UserProfile ({ receiverAddress }: { receiverAddress: undefined | string }) {
  const { user, donateFlow } = useFcl();
  const {data: info, error} = useUserInfo(receiverAddress);
  const [recurring, setRecurring] = useState(false);
  const [flowAmount, setFlowAmount] = useState(0);
  const isSelf = receiverAddress === user?.addr;

  function onSubmit () {
    if (!flowAmount) {
      toast.error("Select FLOW amount!")
      return;
    }
    try {
      // TODO: trigger donation
      // await donateFlow(flowAmount)
    } catch (e) {

    }
  }

  if (error) {
    // TODO: display user friendly errors
    return (
      <Container>
        <div className="dark-background-profile" />
        <pre style={{margin: 20}}>{error.toString()}</pre>
      </Container>
    )
  }

  return (
    <Container>
      <div className="dark-background-profile"/>

      <div className="profile-photo-main-wrapper">
        <img src="/images/profile-photo-main.svg" alt=""/>
        <h3 className="profile-name">{info?.name}</h3>
      </div>

      <div
        className="profile-content-wrapper"
        style={{ maxWidth: isSelf ? 800 : 1200 }}>
        <div className="bio-and-transactions">
          <div className="bio-profile">
            <h5>About {info?.name}</h5>

            <p>
              {info?.description}
            </p>

          </div>

          {/* TODO: use real transactions */}
          <Transaction teaCount={1} fromAddress="0x0f44940e7dd31e6b"/>
          <Transaction teaCount={5} fromAddress="0x0f44940e7dd31e6b"/>
          <Transaction teaCount={100} fromAddress="0x0f44940e7dd31e6b"/>
        </div>
        {!isSelf && (
          <div className="buy-flow-tea-form">
            <h5>Buy {info?.name} a FLOW Tea</h5>
            <ChooseFlowAmount onChange={setFlowAmount} value={flowAmount}/>
            <RepeatPaymentSwitch checked={recurring} onChange={setRecurring}/>
            <PrimaryButton
              onClick={onSubmit}
              style={{ width: '100%', maxWidth: 'unset' }}>
              Support {flowAmount || 'X'} FLOW
            </PrimaryButton>
          </div>
        )}
      </div>
    </Container>
  )
}

function RepeatPaymentSwitch ({
  onChange,
  checked
}: { onChange: (checked: boolean) => void, checked: boolean }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 50,
      marginTop: 50
    }}>
      <div>
        <b style={{ margin: 0 }}>
          Repeat this payment every month
        </b>
        <p style={{ fontSize: 12, margin: 0 }}>
          Don&apos;t worry, you will get an
          email to confirm it every month.
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1
      }}>
        <Switch
          uncheckedIcon={false}
          checkedIcon={false}
          checked={checked}
          onColor={colors.pink}
          onHandleColor={colors.white}
          offColor="#dfdfe1"
          onChange={onChange}/>
      </div>
    </div>
  )
}

function ChooseFlowAmount ({
  onChange,
  value,
  amounts = [1, 3, 10]
}: { onChange: (value: number) => void, value: number, amounts?: number[] }) {
  const [isCustom, setIsCustom] = useState(false);
  return (
    <div style={{ display: 'flex' }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}>
        <img src="/images/flow-tea-cup.svg" alt=""/>
        <X>X</X>
      </div>
      <div
        style={{ flex: 3, display: 'flex', justifyContent: 'space-between' }}>
        {amounts.map(flowAmount => (
          <FlowAmountButton
            key={flowAmount}
            active={!isCustom && flowAmount === value}
            onClick={() => {
              onChange(flowAmount);
              setIsCustom(false);
            }}>
            {flowAmount}
          </FlowAmountButton>
        ))}
        <CustomFlowAmountInput
          active={isCustom}
          placeholder="X"
          type="number"
          onClick={() => setIsCustom(true)}
          onInput={(e) => onChange(e.currentTarget.valueAsNumber)}
        />
      </div>
    </div>
  )
}

const X = styled.span`
  color: ${({ theme }) => theme.colors.darkViolet};
  font-size: 25px;
  font-weight: bold;
`;

const Button = css`
  border: 1px solid ${({ theme }) => theme.colors.darkViolet};
  border-radius: 3px;
  width: 76px;
  height: 68px;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
`;

const FlowAmountButton = styled.button<{ active: boolean }>`
  ${({ active, theme }) => active ? `
      background: ${theme.colors.darkViolet};
      color: white;
  ` : `
      background: white;
      color: ${theme.colors.darkViolet};
  `}
  ${Button}
`;

const CustomFlowAmountInput = styled.input<{ active: boolean }>`
  ${({ active, theme }) => active ? `
      background: ${theme.colors.darkViolet};
      color: white;
      ::placeholder {
        color: white;
      }
  ` : `
      background: white;
      color: ${theme.colors.darkViolet};
  `}
  ${Button};
  height: unset;

  ::placeholder {
    opacity: 0.3;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0;
  }

  &[type=number] {
    -moz-appearance: textfield;
  }
`;

function Transaction ({
  teaCount,
  fromAddress
}: { teaCount: number, fromAddress: string }) {
  return (
    <div className="transactions-profil-details">
      <div className="tea-count">
        <img src="/images/flow-tea-cup.svg" alt=""/>
        <h4>x</h4>
        <h4 className="tea-count-number">{teaCount}</h4>
      </div>
      <h6 className="address-id">Appreciated by {fromAddress}</h6>
    </div>
  )
}

const Container = styled.div`
  .profile-photo-main-wrapper h3 {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .profile-content-wrapper {
    max-width: 1200px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0 auto 100px;
  }

  .profile-content-wrapper > *:first-child {
    margin-right: 30px;
  }

  .profile-content-wrapper h5 {
    font-size: 24px;
    color: var(--main-dark-color);
    font-weight: 700;
  }

  .bio-and-transactions {
    //max-width: 40%;
    flex: 4;
  }

  .bio-profile {
    padding: 50px 30px 50px 30px;
    border: solid 2px #D9D9D9;
    margin-bottom: 50px;
    border-radius: 1%;
  }

  .bio-profile h5 {
    margin-top: 0;
  }

  .bio-profile p {
    margin: 0;
  }

  .bio-link {
    color: var(--secondary-color);
    text-decoration: none;
    font-weight: 500;
  }

  .transactions-profil-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    border: solid 2px #D9D9D9;
    margin-bottom: 20px;
    border-radius: 1%;
  }

  .tea-count {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 80px;
    width: 100%;
    color: var(--dark-violet-color);
  }

  .tea-count img {
    max-width: 30px;
    width: 100%;
  }

  .address-id {
    color: var(--placeholder-text-color);
    font-size: 12px;
    letter-spacing: 0.05em;
    margin-left: 20px;
  }


  .buy-flow-tea-form {
    border: solid 2px #D9D9D9;
    padding: 50px 30px 50px 30px;
    // TODO: use dark background ?
    // background-color: var(--main-dark-color);
    flex: 6;
    border-radius: 1%;
  }

  .buy-flow-tea-form h5 {
    margin-top: 0;
  }

  .profile-photo-main-wrapper {
    text-align: center;
    margin: -80px auto 60px;
  }

  .profile-photo-main-wrapper img {
    max-width: 150px;
    width: 100%;
    margin-bottom: 20px;
  }
`;
