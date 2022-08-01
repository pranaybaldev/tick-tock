import Head from 'next/head'
import DayTimePicker from '@mooncake-dev/react-day-time-picker';
import { useState } from 'react';
import { useRouter } from 'next/router'

export default function Home({ slots }) {

  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleErr, setScheduleErr] = useState('');

  const router = useRouter()
  const { user } = router.query

  const addSlot = async (body) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let res = await fetch(
      `http://localhost:3000/api/slot`, //change this
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
        redirect: "follow",
      }
    );

    res = await res.json();
  };

  const handleScheduled = date => {
    setIsScheduling(true);
    setScheduleErr('');
    let body = {
      "user": user || "pb",
      "start": new Date(date).getTime(),
      "timeSlotSize": 15,
    }
    addSlot(body)
      .then(json => {
        setScheduleErr('');
        setIsScheduled(true);
        setTimeout(() => router.reload(window.location.pathname), 3e3)
      })
      .catch(err => {
        console.log(err);
        setScheduleErr(err);
      })
      .finally(() => {
        setIsScheduling(false);
      });
  };

  const timeSlotValidator = (slotTime) => { //should be optimized. sorting, filtering etc
    const startTimestamps = slots.map((slot) => slot.start);
    if(startTimestamps.includes(slotTime.getTime())){
      return false;
    } else {
      return true;
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Tick Tock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DayTimePicker timeSlotSizeMinutes={15}
      isLoading={isScheduling}
      isDone={isScheduled}
      err={scheduleErr}
      onConfirm={handleScheduled}
      timeSlotValidator={timeSlotValidator}
      />
      
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        svg {
          width: 1rem;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export async function getServerSideProps({query}) {
  try {
    let res = await fetch(`http://localhost:3000/api/slot?user=${query?.user || "pb"}`);
    res = await res.json();
    const slots = res?.message;
    return {
      props: {
        slots,
      },
    };
  } catch (e) {
    console.error(e)
    return {
      props: { slots: [] },
    }
  }
}
