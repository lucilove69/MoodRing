import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import GroupList from '../../components/Groups/GroupList';
import Layout from '../../components/Layout';

export default function GroupsPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="mt-2 text-gray-600">
            Join groups to connect with people who share your interests
          </p>
        </div>
        <GroupList />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}; 