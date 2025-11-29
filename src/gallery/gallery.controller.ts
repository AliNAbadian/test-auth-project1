import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { GalleryWithProductDto } from './dto/response/gallery-response.dto';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all gallery images with their products',
    description:
      'Returns all gallery images including their corresponding product information',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all gallery images with product details',
    type: [GalleryWithProductDto],
  })
  findAll() {
    return this.galleryService.getAllGallery();
  }
}
