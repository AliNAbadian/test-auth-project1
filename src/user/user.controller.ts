import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserGalleryService } from './user-gallery.service';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { userMulterOptions } from 'src/common/multer/multer.config';

// Interceptor for uploading both thumbnail and gallery at once
export const UserUploadInterceptor = () =>
  UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'gallery', maxCount: 20 },
      ],
      userMulterOptions,
    ),
  );

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userGalleryService: UserGalleryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, description: 'Returns user orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getOrders(@Request() req) {
    return this.userService.getOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gallery')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user gallery images' })
  @ApiResponse({ status: 200, description: 'Returns user gallery images' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getGallery(@Request() req) {
    return this.userGalleryService.getUserGallery(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Returns user details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.update(updateUserDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('thumbnail')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload user thumbnail/profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Thumbnail uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('thumbnail', userMulterOptions))
  uploadThumbnail(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.userGalleryService.uploadThumbnail(req.user.id, file, baseUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('thumbnail')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove user thumbnail/profile image' })
  @ApiResponse({ status: 200, description: 'Thumbnail removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeThumbnail(@Request() req) {
    return this.userGalleryService.removeThumbnail(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('gallery')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload gallery images (up to 20)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        gallery: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Gallery image files (max 20)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Gallery images uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'No files uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FilesInterceptor('gallery', 20, userMulterOptions))
  uploadGallery(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.userGalleryService.uploadGalleryImages(
      req.user.id,
      files,
      baseUrl,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('gallery/:imageId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a gallery image' })
  @ApiParam({ name: 'imageId', description: 'Gallery image UUID' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 400, description: 'Image not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeGalleryImage(@Param('imageId') imageId: string, @Request() req) {
    return this.userGalleryService.removeGalleryImage(imageId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload thumbnail and gallery images at once' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },
        gallery: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Gallery image files (max 20)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UserUploadInterceptor()
  uploadFiles(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Req() req,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const results: { thumbnail?: any; gallery?: any } = {};

    // Upload thumbnail if provided
    if (files?.thumbnail?.[0]) {
      results.thumbnail = this.userGalleryService.uploadThumbnail(
        req.user.id,
        files.thumbnail[0],
        baseUrl,
      );
    }

    // Upload gallery images if provided
    if (files?.gallery?.length) {
      results.gallery = this.userGalleryService.uploadGalleryImages(
        req.user.id,
        files.gallery,
        baseUrl,
      );
    }

    return Promise.all([results.thumbnail, results.gallery]).then(
      ([thumbnail, gallery]) => ({
        thumbnail: thumbnail || null,
        gallery: gallery || [],
      }),
    );
  }
}
