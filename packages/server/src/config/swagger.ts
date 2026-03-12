import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Events API',
      version: '1.0.0',
      description: 'API for event management and user authentication',
    },
    servers: [{url: '/'}],
    components: {
      schemas: {
        Event: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            date: {type: 'string', format: 'date'},
            location: {type: 'string'},
            shortDescription: {type: 'string'},
            description: {type: 'string'},
          },
        },
        EventListItem: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            date: {type: 'string', format: 'date'},
            location: {type: 'string'},
            shortDescription: {type: 'string'},
          },
        },
        EventRegistration: {
          type: 'object',
          required: ['fullName', 'email', 'phone', 'password'],
          properties: {
            fullName: {type: 'string'},
            email: {type: 'string', format: 'email'},
            phone: {type: 'string'},
            password: {type: 'string', minLength: 6},
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {$ref: '#/components/schemas/EventListItem'},
            },
            total: {type: 'integer'},
            page: {type: 'integer'},
            limit: {type: 'integer'},
            totalPages: {type: 'integer'},
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            data: {type: 'object'},
            success: {type: 'boolean'},
            message: {type: 'string'},
          },
        },
        AuthRegisterBody: {
          type: 'object',
          required: ['email', 'password', 'fullName'],
          properties: {
            email: {type: 'string', format: 'email'},
            password: {type: 'string', minLength: 6},
            fullName: {type: 'string'},
          },
        },
        AuthLoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {type: 'string', format: 'email'},
            password: {type: 'string'},
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: {type: 'string'},
                    fullName: {type: 'string'},
                    email: {type: 'string'},
                  },
                },
                accessToken: {type: 'string'},
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../app.ts'),
    path.join(__dirname, '../app.js'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
