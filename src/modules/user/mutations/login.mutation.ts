import { inputObjectType, mutationField, nonNull } from 'nexus';
import { generateToken } from '@core/auth/auth.service';
import bcrypt from 'bcryptjs';
import { AuthenticationToken } from '@core/auth/auth.type';
import ERRORS, { throwGraphQLError } from '@core/errors';

const LoginInput = inputObjectType({
  name: 'LoginInput',
  definition(t) {
    t.nonNull.email('email');
    t.nonNull.string('password');
  },
});

const LoginMutation = mutationField('Login', {
  type: AuthenticationToken,
  args: {
    input: nonNull(LoginInput),
  },
  async resolve(_source, { input: { email, password } }, ctx) {
    const user = await ctx.db.user.findOne({ email });
    if (!user) {
      return throwGraphQLError(ERRORS.INVALID_EMAIL_OR_PASSWORD);
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsCorrect) {
      return throwGraphQLError(ERRORS.INVALID_EMAIL_OR_PASSWORD);
    }

    return { token: generateToken(user.id) };
  },
});

export default LoginMutation;
