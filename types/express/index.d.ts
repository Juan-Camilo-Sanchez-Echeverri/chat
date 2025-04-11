declare namespace Express {
  enum Role {
    SuperAdmin = 'superAdmin',
    Professor = 'professor',
    Student = 'student',
    ContentManager = 'contentManager',
    ContentCoordinator = 'contentCoordinator',
  }

  interface Request {
    user: {
      _id: string;
      name: {
        firstName: string;
        lastName: string;
      };
      email: string;
      role: Role;
      grade?: number;
      institution?: string;
    };
  }
}
