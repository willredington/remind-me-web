import { prisma } from '@remind-me/backend/customer/data-db';
import { LocationService } from '@remind-me/backend/customer/data-location';
import { ProfileService } from '@remind-me/backend/customer/data-profile';
import { TaskService } from '@remind-me/backend/customer/data-task';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { SuggestService } from '@remind-me/backend/customer/data-suggest';

function makeServices() {
  const taskService = new TaskService(prisma);
  const profileService = new ProfileService(prisma);
  const locationService = new LocationService(prisma);
  const suggestService = new SuggestService(taskService);

  return {
    taskService,
    profileService,
    locationService,
    suggestService,
  };
}

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const services = makeServices();

  const profile = await services.profileService.findUnique({
    where: {
      userId: 'user-1',
    },
  });

  const auth = {
    profileId: profile.id,
  };

  return { req, res, auth, services };
}

export type Context = inferAsyncReturnType<typeof createContext>;
