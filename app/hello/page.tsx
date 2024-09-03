import { currentUser } from '@clerk/nextjs/server';


const HelloPage = async () => {

  const user = await currentUser();
  return (
    <div>
      hellooo
    </div>
  );
};

export default HelloPage;