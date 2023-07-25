<template>
  <v-row justify="space-around">
      <v-dialog
        transition="dialog-top-transition"
        width="auto"
      >
        <template>
          <v-card>
            <v-toolbar
              color="primary"
              title="Opening from the top"
            ></v-toolbar>
            <v-card-text>
              <div class="text-h2 pa-12">Hello world!</div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                variant="text"
                @click="isActive.value = false"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
  </v-row>
</template>