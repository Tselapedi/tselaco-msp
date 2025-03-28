import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, RespondToAuthChallengeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { AWS_CONFIG } from "@/config/aws-config";
import { RegistrationFormData } from "@/components/auth/RegistrationForm";
import { prisma } from "./prisma";

const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_CONFIG.region,
});

export class AuthService {
  static async registerUser(data: RegistrationFormData) {
    try {
      // Register with Cognito
      const signUpResponse = await cognitoClient.send(
        new SignUpCommand({
          ClientId: AWS_CONFIG.cognito.clientId,
          Username: data.email,
          Password: data.password,
          UserAttributes: [
            {
              Name: "email",
              Value: data.email,
            },
            {
              Name: "given_name",
              Value: data.firstName,
            },
            {
              Name: "family_name",
              Value: data.lastName,
            },
            {
              Name: "phone_number",
              Value: data.phoneNumber,
            },
            {
              Name: "custom:id_number",
              Value: data.idNumber,
            },
            {
              Name: "custom:user_role",
              Value: data.role,
            },
          ],
        })
      );

      // Create user in database
      const user = await prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          idNumber: data.idNumber,
          role: data.role,
          dateOfBirth: new Date(data.dateOfBirth),
          password: "", // We don't store the actual password
        },
      });

      // If registering as a driver, create driver profile
      if (data.role === "DRIVER" && data.vehicleType && data.vehicleMake && data.vehicleModel && data.vehicleYear && data.licensePlate) {
        await prisma.driver.create({
          data: {
            userId: user.id,
            vehicleType: data.vehicleType,
            vehicleMake: data.vehicleMake,
            vehicleModel: data.vehicleModel,
            vehicleYear: data.vehicleYear,
            licensePlate: data.licensePlate,
          },
        });
      }

      return {
        success: true,
        userId: user.id,
        cognitoUser: signUpResponse.UserSub,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      // Initiate auth with Cognito
      const authResponse = await cognitoClient.send(
        new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: AWS_CONFIG.cognito.clientId,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        })
      );

      if (authResponse.ChallengeName) {
        // Handle MFA or other challenges if needed
        return {
          success: false,
          challengeName: authResponse.ChallengeName,
          session: authResponse.Session,
        };
      }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          driverProfile: true,
        },
      });

      return {
        success: true,
        accessToken: authResponse.AuthenticationResult?.AccessToken,
        refreshToken: authResponse.AuthenticationResult?.RefreshToken,
        user,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async verifyEmail(email: string, code: string) {
    try {
      const response = await cognitoClient.send(
        new RespondToAuthChallengeCommand({
          ClientId: AWS_CONFIG.cognito.clientId,
          ChallengeName: "CUSTOM_CHALLENGE",
          ChallengeResponses: {
            USERNAME: email,
            ANSWER: code,
          },
        })
      );

      return {
        success: true,
        response,
      };
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }
} 
