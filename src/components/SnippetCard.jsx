import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { formatSnippetDate } from '../utils/data';

export function SnippetCard({
  snippet,
  onCopy,
  onEdit,
  onDelete,
  onToggleFavorite,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  function closeMenu() {
    setMenuAnchor(null);
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minWidth: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          zIndex: 0,
          inset: '8px -7px -8px 10px',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          bgcolor: 'custom.slip',
        },
      }}
    >
      <Card
        component="article"
        variant="outlined"
        sx={{
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          height: '100%',
          minWidth: 0,
          borderColor: 'divider',
          boxShadow: '0 12px 36px rgba(16, 24, 40, 0.06)',
          transition: 'transform 160ms ease, box-shadow 160ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 18px 44px rgba(16, 24, 40, 0.1)',
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) 96px' },
            gridTemplateRows: { xs: 'minmax(0, auto) 52px', sm: 'auto' },
            minWidth: 0,
            minHeight: { sm: 176 },
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              minHeight: 0,
              p: { xs: 2.25, sm: 2.75 },
              '&:last-child': { pb: { xs: 2.25, sm: 2.75 } },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ minHeight: 0, alignItems: 'flex-start' }}
            >
              <Typography
                component="p"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  maxHeight: 168,
                  overflow: 'auto',
                  overscrollBehavior: 'contain',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  lineHeight: 1.65,
                  fontSize: 16,
                }}
              >
                {snippet.content}
              </Typography>
              <Tooltip
                title={
                  snippet.isStarred
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'
                }
              >
                <IconButton
                  aria-label={
                    snippet.isStarred
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'
                  }
                  onClick={() => onToggleFavorite(snippet)}
                  sx={{
                    mt: -1,
                    mr: -1,
                    flexShrink: 0,
                    color: snippet.isStarred
                      ? 'warning.main'
                      : 'text.secondary',
                  }}
                >
                  {snippet.isStarred ? (
                    <StarRoundedIcon />
                  ) : (
                    <StarBorderRoundedIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack
              direction="row"
              sx={{
                mt: 2,
                pt: 0.5,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontFamily: 'Roboto Mono Variable, monospace',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatSnippetDate(snippet)}
              </Typography>
              <Tooltip title="More Actions">
                <IconButton
                  aria-label="More snippet actions"
                  onClick={(event) => setMenuAnchor(event.currentTarget)}
                >
                  <MoreHorizRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </CardContent>

          <Button
            aria-label={`Copy snippet: ${snippet.content.slice(0, 40)}`}
            onClick={() => onCopy(snippet)}
            startIcon={<ContentCopyRoundedIcon />}
            sx={{
              minWidth: 0,
              minHeight: 44,
              px: 1.5,
              flexDirection: { sm: 'column' },
              gap: { sm: 0.75 },
              borderRadius: 0,
              borderTop: { xs: '1px solid', sm: 0 },
              borderLeft: { xs: 0, sm: '1px solid' },
              borderColor: 'divider',
              bgcolor: 'custom.copyRail',
              color: 'custom.copyFg',
              '& .MuiButton-startIcon': { m: 0 },
              '&:hover': { bgcolor: 'custom.copyHover' },
            }}
          >
            Copy
          </Button>
        </Box>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            onEdit(snippet);
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            onDelete(snippet);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
