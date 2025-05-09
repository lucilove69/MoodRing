import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { formatDistanceToNow } from 'date-fns';

interface GroupMember {
  id: string;
  role: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isPrivate: boolean;
  createdAt: string;
  members: GroupMember[];
  _count: {
    members: number;
    posts: number;
  };
}

export default function GroupPage() {
  const router = useRouter();
  const { id } = router.query;
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGroup();
    }
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch group');
      }
      const data = await response.json();
      setGroup(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">Loading group...</div>
      </Layout>
    );
  }

  if (error || !group) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4 text-red-500">
          Error: {error || 'Group not found'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Group Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-end space-x-4">
                <div className="w-24 h-24 rounded-full bg-white overflow-hidden">
                  {group.avatar ? (
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-3xl font-bold">
                      {group.name[0]}
                    </div>
                  )}
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold">{group.name}</h1>
                  <p className="text-sm opacity-90">
                    {group._count.members} members • Created{' '}
                    {formatDistanceToNow(new Date(group.createdAt))} ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Group Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-gray-600">
                    {group.description || 'No description provided.'}
                  </p>
                </div>

                {/* Group Posts will go here */}
                <div className="mt-6 bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
                  <p className="text-gray-500">No posts yet.</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Members Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Members</h2>
                    <button
                      onClick={() => setShowMembers(!showMembers)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {showMembers ? 'Hide' : 'Show All'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {group.members
                      .slice(0, showMembers ? undefined : 5)
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {member.user.avatar ? (
                              <img
                                src={member.user.avatar}
                                alt={member.user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-sm font-bold">
                                {member.user.username[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.user.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Group Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Group Info</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">
                        {group.isPrivate ? 'Private' : 'Public'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Posts</p>
                      <p className="font-medium">{group._count.posts}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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