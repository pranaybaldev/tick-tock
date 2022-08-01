import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import DayTimePicker from '@mooncake-dev/react-day-time-picker';
import { useState } from 'react';

export default function Home({ isConnected }) {

  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleErr, setScheduleErr] = useState('');

  function fakeRequest(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Uncomment below to trigger error:
        // return reject('Error: KABOOM!');
        resolve({
          status: 'ok',
          scheduled: data
        });
      }, 2e3);
    });
  }

  const handleScheduled = date => {
    console.log('scheduled: ', date);
    setIsScheduling(true);
    setScheduleErr('');
    fakeRequest(date)
      .then(json => {
        setScheduleErr('');
        setIsScheduled(true);
        console.log('fake response: ', json);
      })
      .catch(err => {
        setScheduleErr(err);
      })
      .finally(() => {
        setIsScheduling(false);
      });
  };

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
      onConfirm={handleScheduled} />
      
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

export async function getServerSideProps(context) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
